-- CREATE TABLE users(
-- nid varchar2(15),
-- username VARCHAR2(40),
-- email VARCHAR2(50),
-- password VARCHAR2(20)
-- );

-- CREATE TABLE Passenger (
--     NID VARCHAR2(15) CONSTRAINT PASSENGER_PK PRIMARY KEY,
--     First_Name VARCHAR2(50) NOT NULL,
--     Last_Name VARCHAR2(50) NOT NULL,
--     Date_Of_Birth DATE NOT NULL,
--     Contact_No VARCHAR2(11) NOT NULL,
--     Email VARCHAR2(100) NOT NULL
-- );

-- DROP TABLE PASSENGER

CREATE TABLE PASSENGERS(
    NID VARCHAR2(15) CONSTRAINT PASSENGERS_PK PRIMARY KEY,
    FIRST_NAME VARCHAR2(50) NOT NULL,
    LAST_NAME VARCHAR2(50) NOT NULL,
    DATE_OF_BIRTH DATE NOT NULL,
    CONTACT_NO VARCHAR2(11) NOT NULL,
    EMAIL VARCHAR2(100) NOT NULL
);

--UPDATED
CREATE TABLE LOGIN_CREDENTIALS(
USERNAME VARCHAR2(50) CONSTRAINT LOGIN_CREDENTIALS_PK PRIMARY KEY,
NID VARCHAR2(15),
LOGIN_PASSWORD VARCHAR2(30) NOT NULL,
CONSTRAINT LOGIN_CREDENTIALS_FK FOREIGN KEY (NID) REFERENCES PASSENGERS (NID)
);

CREATE TABLE TRAINS(
TRAIN_ID NUMBER CONSTRAINT TRAINS_PK PRIMARY KEY,
TRAIN_NAME VARCHAR2(30) NOT NULL
);

-- CREATE TABLE TRAIN_HOLIDAY (
--     TRAIN_ID NUMBER,
--     HOLIDAY VARCHAR2(15),
--     CONSTRAINT TRAIN_HOLIDAY_PK PRIMARY KEY (TRAIN_ID, HOLIDAY),
--     CONSTRAINT TRAIN_HOLIDAY_FK FOREIGN KEY (TRAIN_ID) REFERENCES TRAINS (TRAIN_ID)
-- );


--UPDATED
CREATE TABLE TRAIN_HOLIDAY (
    TRAIN_ID NUMBER,
    HOLIDAY_DATE DATE,
    CONSTRAINT TRAIN_HOLIDAY_PK PRIMARY KEY (TRAIN_ID, HOLIDAY_DATE),
    CONSTRAINT TRAIN_HOLIDAY_FK FOREIGN KEY (TRAIN_ID) REFERENCES TRAINS (TRAIN_ID)
);

CREATE TABLE STATIONS(
STATION_ID NUMBER CONSTRAINT STATIONS_PK PRIMARY KEY,
STATION_NAME VARCHAR2(30) NOT NULL
);

-- CREATE TABLE TRAIN_STOPS (
--     TRAIN_ID NUMBER,
--     STATION_ID NUMBER,
--     ARR_TIME VARCHAR2(10) ,
--     DEPT_TIME VARCHAR2(10) ,
--     STOP_TYPE VARCHAR2(10) NOT NULL,
--     STOP_NO NUMBER NOT NULL,
--     CONSTRAINT TRAIN_STOPS_PK PRIMARY KEY (TRAIN_ID, STATION_ID),
--     CONSTRAINT TRAIN_STOPS_FK1 FOREIGN KEY (TRAIN_ID) REFERENCES TRAINS (TRAIN_ID),
--     CONSTRAINT TRAIN_STOPS_FK2 FOREIGN KEY (STATION_ID) REFERENCES STATIONS (STATION_ID)
-- );

--UPDATED
CREATE TABLE TRAIN_STOPS (
    TRAIN_ID NUMBER,
    STATION_ID NUMBER,
	STOP_NO NUMBER NOT NULL,
    ARR_TIME VARCHAR2(10) ,
    DEPT_TIME VARCHAR2(10) ,
    CONSTRAINT TRAIN_STOPS_PK PRIMARY KEY (TRAIN_ID, STATION_ID),
    CONSTRAINT TRAIN_STOPS_FK1 FOREIGN KEY (TRAIN_ID) REFERENCES TRAINS (TRAIN_ID),
    CONSTRAINT TRAIN_STOPS_FK2 FOREIGN KEY (STATION_ID) REFERENCES STATIONS (STATION_ID)
);


CREATE TABLE COMPARTMENTS(
COMPARTMENT_ID NUMBER CONSTRAINT COMPARTMENTS_PK PRIMARY KEY,
TRAIN_ID NUMBER NOT NULL,
COMPARTMENT_NAME VARCHAR2(10) NOT NULL,
CLASS VARCHAR2(15),
CONSTRAINT COMPARTMENTS_FK FOREIGN KEY(TRAIN_ID) REFERENCES TRAINS(TRAIN_ID)
);

CREATE TABLE SEATS (
    COMPARTMENT_ID NUMBER,
    SEAT_NO NUMBER,
    CONSTRAINT SEATS_PK PRIMARY KEY (COMPARTMENT_ID, SEAT_NO),
    CONSTRAINT SEATS_FK FOREIGN KEY (COMPARTMENT_ID) REFERENCES COMPARTMENTS (COMPARTMENT_ID)
);

--UPDATED
CREATE TABLE BOOKSTATUS(
    COMPARTMENT_ID NUMBER,
    SEAT_NO NUMBER,
    BOOKED VARCHAR2(10),
    BOOK_DATE DATE,
    CONSTRAINT BOOKSTATUS_PK PRIMARY KEY (COMPARTMENT_ID, SEAT_NO, BOOKED, BOOK_DATE),
    CONSTRAINT BOOKSTATUS_FK FOREIGN KEY (COMPARTMENT_ID, SEAT_NO) REFERENCES SEATS (COMPARTMENT_ID, SEAT_NO)
);


CREATE TABLE FARE (
    FROM_ST NUMBER,
    TO_ST NUMBER,
	CLASS VARCHAR2(15),
    AMOUNT NUMBER NOT NULL,
    CONSTRAINT FARE_PK PRIMARY KEY (FROM_ST, TO_ST, CLASS),
    CONSTRAINT FARE_FK1 FOREIGN KEY (FROM_ST) REFERENCES STATIONS (STATION_ID),
    CONSTRAINT FARE_FK2 FOREIGN KEY (TO_ST) REFERENCES STATIONS (STATION_ID)
);

--max size has been updated to 100
-- CREATE TABLE RESERVATION (
--     PNR VARCHAR2(20) CONSTRAINT RESERVATION_PK PRIMARY KEY,
--     NID VARCHAR2(15) NOT NULL,
--     COMPARTMENT_ID NUMBER NOT NULL,
--     SEAT_NO NUMBER NOT NULL,
--     FROM_ST NUMBER NOT NULL,
--     TO_ST NUMBER NOT NULL,
--     ISSUE_DATE DATE NOT NULL,
--     DATE_OF_JOURNEY DATE NOT NULL,
--     CONSTRAINT RESERVATION_FK1 FOREIGN KEY (NID) REFERENCES PASSENGERS (NID),
--     CONSTRAINT RESERVATION_FK2 FOREIGN KEY (COMPARTMENT_ID, SEAT_NO) REFERENCES SEATS (COMPARTMENT_ID, SEAT_NO),
--     CONSTRAINT RESERVATION_FK3 FOREIGN KEY (FROM_ST) REFERENCES STATIONS (STATION_ID),
--     CONSTRAINT RESERVATION_FK4 FOREIGN KEY (TO_ST) REFERENCES STATIONS (STATION_ID)
-- );

-- ALTER TABLE RESERVATION
-- MODIFY PNR VARCHAR2(100);

-- ALTER TABLE RESERVATION DROP CONSTRAINT RESERVATION_PK;
-- ALTER TABLE RESERVATION ADD CONSTRAINT RESERVATION_PK PRIMARY KEY (PNR, COMPARTMENT_ID, SEAT_NO);
CREATE TABLE RESERVATION (
    PNR VARCHAR2(200) CONSTRAINT RESERVATION_PK PRIMARY KEY,
    NID VARCHAR2(15) NOT NULL,
    FROM_ST NUMBER NOT NULL,
    TO_ST NUMBER NOT NULL,
    ISSUE_DATE DATE NOT NULL,
    DATE_OF_JOURNEY DATE NOT NULL,
    CONSTRAINT RESERVATION_FK1 FOREIGN KEY (NID) REFERENCES PASSENGERS (NID),
    CONSTRAINT RESERVATION_FK3 FOREIGN KEY (FROM_ST) REFERENCES STATIONS (STATION_ID),
    CONSTRAINT RESERVATION_FK4 FOREIGN KEY (TO_ST) REFERENCES STATIONS (STATION_ID)
);

ALTER TABLE RESERVATION 
ADD TOTAL_FARE NUMBER NOT NULL;

CREATE TABLE BOOKED_SEATS(
  PNR VARCHAR2(200),
  COMPARTMENT_ID NUMBER,
  SEAT_NO NUMBER,
  CONSTRAINT BOOKED_SEATS_PK PRIMARY KEY (PNR,SEAT_NO),
  CONSTRAINT BOOKED_SEATS_FK1 FOREIGN KEY (PNR) REFERENCES RESERVATION(PNR),
  CONSTRAINT BOOKED_SEATS_FK2 FOREIGN KEY (COMPARTMENT_ID,SEAT_NO) REFERENCES SEATS(COMPARTMENT_ID,SEAT_NO)
);

CREATE TABLE PAYMENT(
PAYMENT_ID VARCHAR2(20) CONSTRAINT PAYMENT_PK PRIMARY KEY,
PNR VARCHAR2(20) NOT NULL,
AMOUNT NUMBER NOT NULL,
PAYMENT_TYPE VARCHAR(20) NOT NULL,
CONSTRAINT PAYMENT_FK FOREIGN KEY(PNR) REFERENCES RESERVATION(PNR)
);

CREATE TABLE CARD_PAYMENT(
CARD_NO VARCHAR2(20) CONSTRAINT CARD_PAYMENT_PK PRIMARY KEY,
CARD_HOLDER_NAME VARCHAR2(50) NOT NULL
);

CREATE TABLE MOBILE_BANKING(
AC_NO VARCHAR2(20) CONSTRAINT MOBILE_BANKING_PK PRIMARY KEY,
HOLDER_NAME VARCHAR2(50) NOT NULL
);

CREATE TABLE NEXUS_PAY(
CARD_NO VARCHAR2(20) CONSTRAINT NEXUS_PAY_PK PRIMARY KEY,
HOLDER_NAME VARCHAR2(50) NOT NULL
);

CREATE TABLE CARD_PAY (
    CARD_NO VARCHAR2(20),
    PAYMENT_ID VARCHAR2(20),
    CONSTRAINT CARD_PAY_PK PRIMARY KEY (CARD_NO, PAYMENT_ID),
    CONSTRAINT CARD_PAY_FK1 FOREIGN KEY (CARD_NO) REFERENCES CARD_PAYMENT (CARD_NO),
    CONSTRAINT CARD_PAY_FK2 FOREIGN KEY (PAYMENT_ID) REFERENCES PAYMENT (PAYMENT_ID)
);


CREATE TABLE MOBILE_PAY (
    AC_NO VARCHAR2(20),
    PAYMENT_ID VARCHAR2(20),
    CONSTRAINT MOBILE_PAY_PK PRIMARY KEY (AC_NO, PAYMENT_ID),
    CONSTRAINT MOBILE_PAY_FK1 FOREIGN KEY (AC_NO) REFERENCES MOBILE_BANKING (AC_NO),
    CONSTRAINT MOBILE_PAY_FK2 FOREIGN KEY (PAYMENT_ID) REFERENCES PAYMENT (PAYMENT_ID)
);


CREATE TABLE NEXUS_METHOD (
    CARD_NO VARCHAR2(20),
    PAYMENT_ID VARCHAR2(20),
    CONSTRAINT NEXUS_METHOD_PK PRIMARY KEY (CARD_NO, PAYMENT_ID),
    CONSTRAINT NEXUS_METHOD_FK1 FOREIGN KEY (CARD_NO) REFERENCES NEXUS_PAY (CARD_NO),
    CONSTRAINT NEXUS_METHOD_FK2 FOREIGN KEY (PAYMENT_ID) REFERENCES PAYMENT (PAYMENT_ID)
);
