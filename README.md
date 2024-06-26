# handyman-repairs-fe

## Description

Frontend for full stack project for [Information Systems course](https://www.fer.unizg.hr/en/course/infsys)


React + Spring Boot [backend](https://github.com/Theanko1412/handyman-repairs)


## Usage

### IDE

Install dependencies:
```bash
npm install
```

Run dev:
```bash
npm run dev
```

Run tests (both backend and frontend need to be running):
```bash
npm run dev
npx cypress run
```


By default backend url is set to ```localhost:8080/api/v1/```, to change it set ```REACT_APP_API_URL``` in ```.env``` file or docker env var.


## Screenshots
![home](./support/screenshots/home-page.jpg)
![handymen](./support/screenshots/handyman.jpg)
![services](./support/screenshots/services.jpg)
![admin-services](./support/screenshots/admin-services.jpg)
![admin-schedule](./support/screenshots/schedule.jpg)
![admin-repair](./support/screenshots/repair.jpg)
![user-booking](./support/screenshots/userbook.jpg)
![user-schedule](./support/screenshots/userschedule.jpg)
![services-dark](./support/screenshots/services-dark.jpg)