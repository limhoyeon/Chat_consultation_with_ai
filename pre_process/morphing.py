from khaiii import KhaiiiApi
import pandas as pd

# 판다스로 훈련셋과 테스트셋 데이터 로드
train1 = pd.read_csv("./ratings_spacing_train.txt", sep='\t',header=None)
train2 = pd.read_csv("./ratings_spacing_test.txt", sep='\t',header=None)

# 정상적으로 로드 되었는가 확인
print(train1[1])
print(type(train1))
print(train2[1])
print(type(train2))


#모든 train 문장에 대해 khaiii 실행
for i in range(len(train1[1])):
    if(type(train1[1][i])==float):
        continue
    khai=api.analyze(train1[1][i])
    converted=""
    for eojeol in khai:
        for morph in eojeol.morphs:
            converted+=str(morph)+" "
    train1[1][i]=converted
    if(i%500==0):
        print("%d/150000 lefted"%(i))
#모든 test 문장에 대해 khaiii 실행
for i in range(len(train2[1])):
    if(type(train2[1][i])==float):
        continue
    khai=api.analyze(train2[1][i])
    converted=""
    for eojeol in khai:
        for morph in eojeol.morphs:
            converted+=str(morph)+" "
    train2[1][i]=converted
    if(i%500==0):
        print("%d/150000 lefted"%(i))
#정상적으로 완료되었는지 확인
print(train1)
print(train2)
#저장
train1.to_csv("./train_morphs.txt",header=None,index=None,sep='\t')
train2.to_csv("./test_morphs.txt",header=None,index=None,sep='\t')
