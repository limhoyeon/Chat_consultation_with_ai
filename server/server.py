from khaiii import KhaiiiApi
from pykospacing import spacing
import tensorflow as tf
import torch
from pytorch_pretrained_bert import BertForSequenceClassification
from transformers import AdamW, BertConfig
from transformers import get_linear_schedule_with_warmup
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
from keras.preprocessing.sequence import pad_sequences
import pandas as pd
import numpy as np
import random
import time
import datetime
from pytorch_pretrained_bert.tokenization_morp import BertTokenizer
import firebase_admin
from threading import Lock
from firebase_admin import credentials
from firebase_admin import firestore

#바뀐 docs가 저장되는 list
changed_docs=list()

#동기화를 위해 Lock 변수 설정
lock = Lock()

#파이어 스토어에 인증
cred = credentials.Certificate("./senti-937c7-firebase-adminsdk-zi8lg-4f960817e0.json")
default_app=firebase_admin.initialize_app(cred,{'databaseURL': 'https://senti-937c7.firebaseio.com/users/hoyeon94@korea.com'})
store=firestore.client()

#KHAIII API 선언
api=KhaiiiApi()

#토크나이저 선언
tokenizer = BertTokenizer.from_pretrained("./vocab.korean_morp.list", do_lower_case=False)

#토큰 개수의 최대값 설정
MAX_LEN = 256

# 디바이스 설정
if torch.cuda.is_available():    
    device = torch.device("cuda")
else:
    device = torch.device("cpu")
# 분류를 위한 BERT 모델 생성
model = BertForSequenceClassification.from_pretrained("/home/jupyter/pytorch-korbert", num_labels=2)

# 모델 로드
checkpoint = torch.load('./kor_bert_senti1',map_location=torch.device('cpu'))
model.load_state_dict(checkpoint['model_state_dict'])

#update 모듈 
def update(changing_doc):
    for i in range(len(changing_doc['messages'])):
        if( (changing_doc['messages'][i]['sender'] != 'admin') and (changing_doc['messages'][i]['complain']== 100 ) ):
            changing_doc['messages'][i]['complain']=int(analysis(changing_doc['messages'][i]['message'])*100)
        else:
            continue
        doc=store.document('chats',changing_doc['tel']).update(changing_doc)

#이벤트 리스너 콜백함수
def on_snapshot(collection_snapshot, changes, read_time):
    global changed_docs
    if(len(changes)>6):
        return
    for change in changes:
        change_doc=change.document.to_dict()
        changed_docs.append(change_doc)
        
#데이터 전처리 모듈
def data_pre(message):
    global api
    global tokenizer
    message=message.replace(' ', '')
    message=spacing(message)
    api = KhaiiiApi()
    test_tokn=api.analyze(message)
    test_sentence=""
    for eojeol in test_tokn:
        for morph in eojeol.morphs:
            test_sentence+=str(morph)+" "
    test_sentence="[CLS] "+test_sentence+" [SEP]"
    test_sentence =tokenizer.tokenize(test_sentence)
    while('_' in test_sentence):
        test_sentence.remove('_')
    test_sentence_ids =tokenizer.convert_tokens_to_ids(test_sentence)
    test_sentence_ids = pad_sequences([test_sentence_ids], maxlen=MAX_LEN, dtype="long", truncating="post", padding="post")
    while('_' in test_sentence):
        test_sentence.remove('_')
    test_sentence_mask = [[float(i>0) for i in test_sentence_ids[0]]]
    test_inputs = torch.tensor(test_sentence_ids)
    test_masks = torch.tensor(test_sentence_mask)
    return (test_inputs,test_masks)

#데이터 분석 모듈
def data_pro(inputs,masks):
    model.eval()
    # 그래디언트 계산 안함
    with torch.no_grad():
        outputs = model(inputs, 
                        token_type_ids=None, 
                        attention_mask=masks)
    logits = outputs
    prob=np.exp(logits[0][1])/(np.exp(logits[0][1])+1)
    return float(prob)
def analysis(message):
    pre=data_pre(message)
    return data_pro(pre[0],pre[1])

#이벤트 리스너
collection_ref = store.collection('chats')
collection_watch = collection_ref.on_snapshot(on_snapshot)
print("준비가 끝났다.")
while(1):
    if(len(changed_docs)!=0):
        lock.acquire()
        try:
            update(changed_docs.pop(0))
        finally:
            lock.release()
    
