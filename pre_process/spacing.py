pip install git+https://github.com/haven-jeon/PyKoSpacing.git

from pykospacing import spacing
import pandas as pd
from google.colab import drive

#드라이브에 마운트
drive.mount('/content/drive')

#train,test data set을 불러옴.
data_train = pd.read_csv('/content/drive/My Drive/하/ratings_train.txt',sep='\t')
data_test = pd.read_csv('/content/drive/My Drive/하/ratings_test.txt',sep='\t')
print(data_train)
print(data_test)

#띄어쓰기를 모두 제거
data_train['document'] = data_train['document'].replace(' ', '', regex = True) #문자열의 괄호 제거.
data_test['document'] = data_test['document'].replace(' ', '', regex = True) #문자열의 괄호 제거.

#띄어쓰기 전
print(data_train.head(10))
print(data_test.head(10))

#pykospacing을 통해 띄어쓰기 진행
for i in range(len(data_train)):
  if(type(data_train['document'][i])==float):
    data_train['document'][i]=""
  data_train['document'].iloc[i] = spacing(data_train['document'].iloc[i])
  if(i%500==0):
    print(i)
for i in range(len(data_test)):
  if(type(data_test['document'][i])==float):
    data_test['document'][i]=""
  data_test['document'].iloc[i] = spacing(data_test['document'].iloc[i])
  if(i%500==0):
    print(i)

#띄어쓰기 후
print(data_train)
print(len(data_train))
print(data_test)

#띄어쓰기 완료된 파일을 저장.
data_train.to_csv('/content/drive/My Drive/하/ratings_spacing_train.txt', index=False, header=None, sep="\t")
# data_test.to_csv('/content/drive/My Drive/하/ratings_spacing_test.txt', index=False, header=None, sep="\t")
