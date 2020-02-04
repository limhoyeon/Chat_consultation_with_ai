# Hugging Face의 트랜스포머 모델을 설치
!pip install transformers
!pip install pytorch_pretrained_bert==0.4.0
import tensorflow as tf
import torch
from pytorch_pretrained_bert import BertForSequenceClassification
from transformers import AdamW, BertConfig
from transformers import get_linear_schedule_with_warmup
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
from keras.preprocessing.sequence import pad_sequences
import pandas as pd
import random
import time
import datetime

#드라이브에 마운트
from google.colab import drive
drive.mount('/content/drive')

#기본 BERT모델의 tokenizer를 ETRI 한국어 버트 모델의 tokenizer으로 변경함.
#한국어 버트 모델 다운로드를 위해서 ETRI의 승인을 받아야 합니다.
!cp "/content/drive/My Drive/bert_pytorch/001_bert_morp_pytorch/src_tokenizer/tokenization_morp.py" /usr/local/lib/python3.6/dist-packages/pytorch_pretrained_bert/
from pytorch_pretrained_bert.tokenization_morp import BertTokenizer



# 판다스로 훈련셋 데이터 로드
test_data = pd.read_csv("/content/drive/My Drive/하/test_morphs.txt", sep='\t',header=None)
train_data=pd.read_csv('/content/drive/My Drive/하/train_morphs.txt', sep='\t',header=None)
print(train_data)
print(test_data)

# 훈련 데이터 셋 리뷰문장에 CLS,SEP 삽입
sentences_train=list()
for i in range(len(train_data[1])):
  if(type(train_data[1][i])==float):
    sentences_train.append("[CLS] [SEP]")
  else:
    sentences_train.append("[CLS] "+train_data[1][i]+" [SEP]")
sentences_test=list()
# 테스트 데이터 셋 리뷰문장에 CLS,SEP 삽입
for i in range(len(test_data[1])):
  if(type(test_data[1][i])==float):
    sentences_test.append("[CLS] [SEP]")
  else:
    sentences_test.append("[CLS] "+test_data[1][i]+" [SEP]")
#정상적으로 삽입되었는지 확인.
print(sentences_train[0:9])
print(len(sentences_train))
print(sentences_test[0:9])
print(len(sentences_test))


#훈련 셋 라벨 추출
labels_train = list()
for i in range(len(train_data[2])):
  labels_train.append(train_data[2][i])
#정상적으로 추출되었는지 확인
print(labels_train)
print(len(labels_train))
print(labels_train[0:9])
#테스트 셋 라벨 추출
labels_test = list()
for i in range(len(test_data[2])):
  labels_test.append(test_data[2][i])
#정상적으로 추출되었는지 확인
print(labels_test)
print(len(labels_test))
print(labels_test[0:9])

#메모리 최적화를 위해 필요 없는 변수 삭제
del(train_data)
del(test_data)



# 한국어 버트 모델의 BERT의 토크나이저로 문장을 토큰으로 분리
tokenizer = BertTokenizer.from_pretrained("/content/drive/My Drive/bert_pytorch/001_bert_morp_pytorch/vocab.korean_morp.list", do_lower_case=False)
tokenized_train_texts = [tokenizer.tokenize(sent) for sent in sentences_train]
print (sentences_train[0])
print (tokenized_train_texts[0])
print(len(tokenized_train_texts))

# BERT의 토크나이저로 문장을 토큰으로 분리
tokenized_test_texts = [tokenizer.tokenize(sent) for sent in sentences_test]
print (sentences_test[0])
print (tokenized_test_texts[0])
print(len(tokenized_test_texts))

#필요 없는 변수 삭제
del(sentences_train)
del(sentences_test)
    
_removed_tokenized_train_texts=list()
for sent in tokenized_train_texts:
  while('_' in sent):
    sent.remove('_')
  _removed_tokenized_train_texts.append(sent)


_removed_tokenized_test_texts=list()
for sent in tokenized_test_texts:
  while('_' in sent):
    sent.remove('_')
  _removed_tokenized_test_texts.append(sent)


  #필요 없는 변수 삭제
del(tokenized_train_texts)
del(tokenized_test_texts)    
 
