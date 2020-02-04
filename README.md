<h1>Chat_consultation_with_ai</h1>
<h2>감성 분류 채팅 상담 프로그램</h2> <br>
<ul><a href="https://senti-937c7.firebaseapp.com/login">Click to go to user web</a></ul>
<ul><a href="https://admin-8e100.firebaseapp.com/login">Click to go to admin web</a></ul>
<ul><a href="https://www.youtube.com/watch?v=XL6ClP2OJe8&feature=youtu.be">작동 영상</a></ul>

<h3>프로그램 설명</h3>
<p>
  간단한 채팅상담 프로그램입니다. 고객은 전화번호를 입력해 인증을 받고, 상담사는 이메일 인증을 통해 접속합니다.<br>
  만약 고객의 채팅을 감성 분류한 결과가 안좋게 나온다면, 고객의 메세지가 빨간색으로 표시되며<br>
  상담사는 이를 바로 캐치할 수 있고, 알림이 떠서 관리자또한 캐치할 수 있습니다.
</p>


<h3>데이터</h3>
<p>
  네이버 영화리뷰 데이터를 사용하였습니다.(https://github.com/e9t/nsmc/)<br>
</p>

<h3>/pre_process</h3>
<p>
  /spacing.py : 학습 데이터 띄어쓰기<br>
  /morphing.py : 문장을 형태소로 변환
</p>

<h3>/server</h3>
<p>
  /server.py : 백엔드 서버에서 돌아가는 코드입니다. 서버에 BERT를 올리고 파이어베이스와 연동합니다.<br>
  인공지능을 통해 고객의 메세지를 분석합니다.
</p>

<h3>/learning</h3>
<p>
  /learning.ipynb : 한국어 BERT 형태소 모델을 이용해 학습하는 코드입니다. 한국어 BERT 형태소 모델은<br>
  ETRI에서 다운받을 수 있습니다.
</p>

<h3>/client_app<br>/admin_app</h3>
<p>
  React기반 웹페이지 소스코드입니다.
</p>
