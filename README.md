## 📝 일잘로 📝

### 🔎 소개
업무 효율성 증대를 위한 팀원간 공유 칸반보드 프로젝트

### 🕰️ 개발 기간
- 2024.03.18 목 ~ 2024.03.25 목

### ⚙️ 개발 환경
- 언어 : TypeScript
- Backend: Nest.js
- Frontend : react
- Database: AWS RDS (MySQL), Redis, S3
- Version Control: GitHub

### 📌 주요 기능
1. Board 관리
사용자는 여러 개의 칸반보드를 생성. 각 보드는 프로젝트 또는 팀별로 관리될 수 있으며, 보드 안에서 여러 작업(Column 및 Task)을 관리할 수 있음.
사용자는 생성된 보드를 조회, 수정, 삭제할 수 있으며, 보드 내에 초대받은 팀원들과 협업할 수 있음.
2. Column 관리
컬럼을 추가, 수정, 삭제할 수 있으며, 컬럼 순서를 자유롭게 변경할 수 있음.
3. Task 관리
작업을 추가, 조회, 수정, 삭제할 수 있으며, 작업을 다른 컬럼으로 드래그 앤 드롭하여 상태를 변경할 수 있음.
4. User 및 권한 관리
메일 인증을 통해 가입.
사용자는 개인 계정을 통해 로그인할 수 있으며, 각 보드마다 초대받거나 초대할 수 있는 권한이 있음.
보드의 관리자는 팀원들을 보드에 초대하거나, 보드에서 제거할 수 있음
5. 알림
Task 순서 변경 알림 기능.
6. 댓글 첨부파일 기능

### 🔒 환경변수
* DB
  - DB_HOST
  - DB_PORT=3306
  - DB_USERNAME
  - DB_PASSWORD
  - DB_NAME
  - DB_SYNC
  - JWT_SECRET_KEY
* 메일러
  - SMTP
  - SMTP_ID
  - PRIVKEY
  - SMTP_PORT
  - SMTP_SSL
  - SMTP_FROM_NAME
  - SMTP_FROM_EMAIL
* Redis
  - REDIS_HOST
  - REDIS_PORT
  - REDIS_PASSWORD
* S3
  - S3_ACCESSKEY
  - S3_SECRETKEY
  - BUCKET_NAME
* Client
  - REACT_APP_API_BASE_URL

 ### ✒ 문서
 - API : [https://serious-airedale-c1e.notion.site/31eac16ad5c140dcb73391ee89f06580?v=50a5eb2d3bc24db9bc2f1bc1745b9714&pvs=4](https://serious-airedale-c1e.notion.site/7c02ca4c9ea24916826293c83d56e59d?v=45565b7344104726b7b33f3001b13dc5&pvs=4)https://serious-airedale-c1e.notion.site/7c02ca4c9ea24916826293c83d56e59d?v=45565b7344104726b7b33f3001b13dc5&pvs=4
 - ERD : https://drawsql.app/teams/-901/diagrams/8

