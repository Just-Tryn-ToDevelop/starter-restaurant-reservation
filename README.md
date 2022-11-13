# Capstone: Restaurant Reservation System

Link to live application: [Restaurant Reservation App](https://restaurant-app-capstone-frontend.onrender.com)

Restaurant Reservation System is an app for for managing and creating reservations, table occupancy and tables. 

## Dashboard

**Easily view current reservations and their status, along with tables and their status/availability, in one place. Reservations can have a status of `'booked'`, `'seated'`, `'finished'` or `'cancelled'`. Only `'booked'` and `'seated'` reservations are rendered to the list.** 

<kbd>![image](https://user-images.githubusercontent.com/102090637/200983692-d5d42b05-031d-4578-8e6d-13f6e9a694bb.png)<kbd>

<br />
<br />

**The `Options` dropdown button contains links to the seat and edit reservation components.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200984132-abb2d1a4-d01d-4af5-bf19-ef4a2571672e.png)<kbd>

<br />
<br />

**Clicking on the `Seat` option will take you to the 'Seat Guests' screen where you can assign the reservation to a table.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200984423-387184ca-38f6-4097-bed9-bf86085a6e7d.png)<kbd>

<br />
<br />

**Upon submitting, you are sent back to the dashboard where the status of whichever table was chosen, has changed to `'occupied'`, and the status of the reservation has changed to `'seated'`. A `Finish` button appears next to the occupied table, so that you may reset the status of a table when the guests are done.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200984570-eaa6e975-b99e-4961-8f42-0af027925688.png)<kbd>

<br />
<br />

**Clicking the `Finish` button shows a modal asking if the table is ready to seat new guests.**

<kbd>![200985768-fa5ffbf5-bd9c-4a21-b803-7b7e12ebd564 (2)](https://user-images.githubusercontent.com/102090637/200986704-ae2ba144-b9ee-4cff-b4ed-accdfd961101.png)<kbd>

<br />
<br />

**Upon clicking `OK`, the status of the reservation changes to `'finished'`, removes it from the reservations table, and changes the status of the table back to `'free'` so that it can seat the next guests. Clicking `Cancel` does nothing.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200986866-96f2bcbb-7238-48b9-b21f-ae20c3223f31.png)<kbd>

<br />
<br />

**As shown before, clicking on the `Edit` option within the `Options` dropdown, on the Dashboard page, will take you to the 'Edit Reservation' screen where you can edit the reservation.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/201487540-fbfddd9c-8f06-4866-b601-071a295b0620.png)<kbd>

<br />
<br />

## New Reservation

**New reservations can be created within this component. The edit and create reservation components share the same form component.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200987625-171d0b2c-8785-45cd-9204-f0242356b24e.png)<kbd>

<br />
<br />

## Search

**Search for reservations by phone number. Reservations of *any* status, will appear in the results list.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/201488884-89bd1828-0768-43f8-bf4b-bd6a2887ed62.png)<kbd>

<br />
<br />

## New Table

**Create a new table to assign a reservation to.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200988054-e7dd4c1c-2921-4a6c-adc9-c16e15ae13b4.png)<kbd>

<br />
<br />

## Responsive Layout

**Allows for easy viewing on any device. Click the `Reservations` button and then the `Tables` button, or vice versa, to see both tables at the same time.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200990365-7ea77d42-7cf8-4a57-97f9-95130e278c03.png)<kbd>

<br />
<br />

**Clicking either button more than once will toggle the associated table to be visible or hidden. <br />
Click only the `Reservations` button to see reservations only.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200990536-93aae9a0-ce84-4f9d-9577-989c0a808b96.png)<kbd>

<br />
<br />

**Click only the `Tables` button to see tables only.**

<kbd>![image](https://user-images.githubusercontent.com/102090637/200990719-ae0496ac-328a-4d0d-b8b3-8c02fc1f1f70.png)<kbd>

<br />
<br />

## Technology - Monorepo

**Front end built with:**
* React and Bootstrap  

**Back end built with:**
* Node.js
  * Express server framework
  * CORS
* PostgreSQL Database
  * Knex.js for query building

## API Documentation

All requests return a JSON response and have appropriate validation middleware as well as JSON bodies.

### Endpoints for reservations route:

#### List / Create Reservations
----
  Creates a reservation and fetches reservations for a specific date. Fetches to /reservations?date=<reservation_date> on the Dashboard page of the client, are rerouted to url path '/dashboard'.

* **URL**

  /reservations

* **Method:**

  `GET` | `POST`
  
*  **URL Query**

   **Required for `GET` request:**
 
   `date=[date]`

* **Data Params**

  first_name: `string` <br />
  last_name: `string` <br />
  mobile_nmber: `string` <br />
  reservation_date: `date` <br />
  reservation_time: `time` <br />
  people: `number` <Must be at least 1 person> <br />

* **Success Response:**

  * **Code for `'POST'`:** 201 <br />
    **Content:** { <br />
    	`reservation_id: "1"` <br />
   	`first_name: "John"` <br />
	`last_name: "Doe"` <br />
	`mobile_number: "773-745-6768"` <br />
	`people: 4` <br />
	`reservation_date: "2022-11-12"` <br />
	`reservation_time: "14:00"`<br />
	`status: "booked" <default value assigned to every new reservation>` <br />
      } <br />
      
  * **Code for `'GET'`:** 200 <br />
    **Content:** { <br />
    	`reservation_id: "1"` <assigned and incremented by database> <br />
   	`reservation_id: "1"` <br />
   	`first_name: "John"` <br />
	`last_name: "Doe"` <br />
	`mobile_number: "773-745-6768"` <br />
	`people: 4` <br />
	`reservation_date: "2022-11-12"` <br />
	`reservation_time: "14:00"`<br />
	`status: "booked"` <br />
	`created_at: "2022-11-10T02:40:26.331Z"` <database time stamp> <br />
	`updated_at: "2022-11-10T02:40:26.331Z"` <database time stamp> <br />
      } <br />
 
 
#### Read / Update Reservations
----
  Reads reservations pertaining to a specific reservation_id and updates individual reservations.

* **URL**

  /reservations/:reservation_id

* **Method:**

  `GET` | `PUT`
  
*  **URL Params**

   **Required:**
 
   `reservation_id=[integer]`

* **Success Response:**

  * **Code for `'PUT'`:** 200 <br />
    **Content:** { <br />
    	reservation_id: "1" <br />
   	`first_name: "James"` <br />
	last_name: "Doe" <br />
	mobile_number: "773-745-6768" <br />
	people: 4 <br />
	reservation_date: "2022-11-10" <br />
	reservation_time: "20:40:00" <br />
	status: "booked" <br />
	created_at: "2022-11-10T02:40:26.331Z" <database time stamp> <br />
	updated_at: "2022-11-10T02:40:26.331Z" <database time stamp> <br />
      }
      
  * **Code for `'GET'`:** 200 <br />
    **Content:** {  <br />
    	`reservation_id: "1"` <assigned and incremented by database> <br />
   	`reservation_id: "1"` <br />
   	`first_name: "John"` <br />
	`last_name: "Doe"` <br />
	`mobile_number: "773-745-6768"` <br />
	`people: 4` <br />
	`reservation_date: "2022-11-12"` <br />
	`reservation_time: "14:00"`<br />
	`status: "booked"` <br />
	`created_at: "2022-11-10T02:40:26.331Z"` <database time stamp> <br />
	`updated_at: "2022-11-10T02:40:26.331Z"` <database time stamp> <br />
      }
      
      
#### Update Reservation Status
----
  Updates the status of the reservation whenever the status of the reservation changes. `(e.g. booked to cancelled or booked to seated)`

* **URL**

  /reservations/:reservation_id/status

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `reservation_id=[integer]`

* **Success Response:**

  * **Code for `'PUT'`:** 200 <br />
    **Content:** { <br />
    	reservation_id: "1" <br />
   	first_name: "James" <br />
	last_name: "Doe" <br />
	mobile_number: "773-745-6768" <br />
	people: 4 <br />
	reservation_date: "2022-11-10" <br />
	reservation_time: "20:40:00" <br />
	`status: "seated"` <br />
	created_at: "2022-11-10T02:40:26.331Z" <database time stamp> <br />
	updated_at: "2022-11-10T02:40:26.331Z" <database time stamp> <br />
      }
      
      
### Endpoints for tables route:

#### List / Create Tables
----
  Creates a table and fetches tables to be rendered on the dashboard page. Fetches to /tables on the Dashboard page of the client, are rerouted to url path '/dashboard'.

* **URL**

  /tables

* **Method:**

  `GET` | `POST`

* **Data Params for `POST`**

  table_name: `string` <br />
  capcity: `integer` <Must be at least 1 person> <br />

* **Success Response:**

  * **Code for `'POST'`:** 201 <br />
    **Content:** { <br />
   	`table_id: "1"` <assigned and incremented by database> <br />
   	`table_name: "Bar #1"` <br />
	`capacity: 6` <br />
	`reservation_id: "null"` <default value assigned to every new or un-occupied table> <br />
	`created_at: "2022-11-10T02:40:26.331Z"` <database time stamp> <br />
	`updated_at: "2022-11-10T02:40:26.331Z"` <database time stamp> <br />
      } <br />
      
  * **Code for `'GET'`:** 200 <br />
    **Content:** { <br />
    	`table_id: "1"` <br />
   	`table_name: "Bar #1"` <br />
	`capacity: 6` <br />
	`reservation_id: "null"`  <br />
	`created_at: "2022-11-10T02:40:26.331Z"` <br />
	`updated_at: "2022-11-10T02:40:26.331Z"` <br />
      } <br />
 
 
#### Delete / Update Tables
----
  Delete uses the `PUT` request to change the value of reservation_id on a table, to 'null', upon the finishing of a table. Update changes the status of a reservation to 'seated', and changes the value of the reservation_id of the table, from 'null', to the reservation_id associated with the reservation to be seated.

* **URL**

  /tables/:table_id/seated

* **Method:**

  `DELETE` | `PUT`
  
*  **URL Params**

   **Required:**
 
   `table_id=[integer]`

* **Success Response:**

  * **Code for `'PUT'`:** 200 <br />
    **Content:** { <br />
    	table_id: "1" <br />
   	table_name: "Bar #1" <br />
	capacity: 6 <br />
	`reservation_id: "2"`  <br />
	created_at: "2022-11-10T02:40:26.331Z" <br />
	updated_at: "2022-11-10T02:40:26.331Z" <br />
      }
      
  * **Code for `'DELETE'`:** 200 <br />
    **Content:** {  <br />
    	table_id: "1" <br />
   	table_name: "Bar #1" <br />
	capacity: 6 <br />
	`reservation_id: "null"`  <br />
	created_at: "2022-11-10T02:40:26.331Z" <br />
	updated_at: "2022-11-10T02:40:26.331Z" <br />
      }
      
      
