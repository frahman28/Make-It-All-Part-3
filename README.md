#
# Team Projects Part 3 Report (Team 15)

## Understanding the Initial Requirements

After learning about our groups, we sat down and went over the client&#39;s requirements as a group. We were able to divide the task into smaller subproblems that could be worked on separately and then combined. These smaller subproblems made the task appear more manageable, and they also made it easier for us to create a Gantt chart to track our progress and get a sense of how much should be done and when.

Based on the initial requirements, we were curious about the need for operatorsso we asked Miss Lovelace about allowing helpdesk users to look up their own problems and submit their own forms for contacting specialists. We later discovered that the operator role was no longer available at Make-It-All. This sparked the idea of creating a dashboard where users could log in and see a list of the problems they had submitted to specialists. **Users will be able to search for a list of solved problems that may match problems they&#39;re currently experiencing, removing the need for specialists to constantly respond to similar problems with the same answers**. Finally, they will require a form to submit problems to specialists for resolution; this process will be very similar to how operators submitted problems in the previous version of the system.

Specialists will have a role that is very similar to what they were doing in the previous part, with their role remaining mostly unchanged: solving problems that are assigned to them. As a team, we wanted to make this process easier for specialists, so we planned on having a way for specialists to **easily look up previously solved problems** in order to provide answers for similarly solved problems.

In the previous part, there was a desire for analytics of problems, such as how quickly they are solved, what problems are most frequently created, and so on. We felt there was a greater need for this part as well. To reflect on this, we planned to **create a dedicated account for analysts to easily track the helpdesk&#39;s performance**. Filtering performance by dates, problem types, and similar factors. This change should allow the helpdesk to focus more on users being able to quickly get solutions to their problems, which is one of Miss Lovelace&#39;s new requirements, as it will be easier to identify areas where the helpdesk is underperforming, such as specialists lacking training in specific problem types.

| **Requirement** | **Fit Criteria** | **Rationale** |
| --- | --- | --- |
| Employees can submit their own problems. | Is there a way for employees to report problems? If they submit a problem, it is assigned to a specialist who can provide assistance with the problem.. | To make the process more streamlined and efficient, the operator role has been eliminated, and problems are now transferred to specialists. |
| Users can look up previously solved problems. | Can employees and specialists search for previously resolved issues? Can they search through these problems to find a more precise result for what they&#39;re looking for? | To avoid wasting specialists&#39; time by submitting repeated problems, employees and specialists should be able to easily look up previously solved problems to see if any match. |
| Provide analysis for the system. | There is a page that displays charts that show the system&#39;s performance metrics. The charts can be filtered by two dates, and they will update to reflect this. | The admins should be able to monitor and see how well the system is working, as well as identify areas for improvement, such as when a specialist takes too long to solve a problem. |
| Security is provided to prevent unauthorised access. | Check whether unauthorised accounts have access to pages they should not have. Employees, for example, should not be able to access the analysis dashboard. Users who have not logged in should be unable to access any pages other than the login page. | With employee information available and the ability to change this information, it is critical that only authorised users can view and edit this. |
| Problem types can be created and deleted. | When an admin creates a problem type, it is accurately reflected in the database, and the problem type is added for all select options across the site. The same goes for deleting problems that have that problem type handled correctly, such as by reassigning the problem type. | As time passes, new problem types that the system did not initially support may emerge; being able to create these new problem types ensures that the system is future proof. |
| Specialists can assign and design problem types they can work on. | If a specialist designates a new problem type, they will only receive problems of that type. Same as for removing, specialists will no longer receive problems of that type. | Specialists may receive training for a new problem type; however, they must then add the problem type to their account in order to begin receiving problems based on it. |
| Employees and specialists can easily keep track of their current outgoing / assigned problems. | On their dashboard, specialists will see problems that have been assigned to them. They can then choose a problem to provide comments on. Employees will see a list of problems they have submitted. | On their dashboard, specialists will see problems that have been assigned to them. They can then choose a problem to provide comments on. Employees will see a list of problems they have submitted. |
| Administrators can add equipment (hardware, software, operating system), update one or delete one. | An admin user who is logged in will be able to access dropdown rows with forms on the equipment viewing page, allowing them to submit details for new equipment, update details for existing equipment, and delete a row. | If the company implements new hardware, software, or operating systems, the database can be easily updated to match the inventory, making the rest of the company operations run more smoothly. |

### User Stories

- As an admin, I want to be able to keep track of my employees and ensure that they receive the help they require for their problems in a timely and efficient manner. I want to be able to see if people are submitting a large number of problems about a specific problem type, such as the printers we use in the office. I also want to be able to track how well specialists perform; if a specialist takes too long to answer questions, we&#39;ll need to train them more, especially if they&#39;re falling behind their team.
- As an admin, I need to be able to send my employees on holiday; everyone, especially specialists, deserves a break. However, while these specialists are on vacation, they should not encounter any issues! Otherwise, my employees will have to wait for this specialist to return before receiving an answer. It will also have an impact on our performance metrics.
- As a specialist, I want quick access to previous solutions when attempting to solve a problem. Having this ability on the same page would be great because it would allow me to look at the problem details all in one window while trying to think of a solution, making me more efficient and also giving me an idea if this is a repeated question. If this ability was on another page, I might not bother using it.
- As an employee, I need to be able to look up solutions to problems that are similar to mine, but if I can&#39;t find any, I want to be able to submit my own problem and receive direct help. I don&#39;t know many of the specialists, so don&#39;t make me choose from a list of who should be assigned; I&#39;d just randomly click on a name.

## Gantt Chart

Based on what we had learned in the previous part and with the help of our Team Managers, we created a Gantt chart to track our progress. This was made before any coding began. Because we had broken down the initial requirements into smaller subproblems that we could tackle individually, these smaller tasks were then used for the Gantt chart. The Gantt chart also accounted for the Easter break because we knew we wouldn&#39;t be working as much or meeting as much during this time, so it was unrealistic to expect continuous development during this time. This Gantt chart was also uploaded to Trello as a reference to show us where we should be based on the date. We expected to do testing and the report during active development from the start date to the end date, not as a last-minute task to be completed, as new features should be tested before being implemented.

## Database Schema ![](RackMultipart20220516-1-f0s1ce_html_5e7e7e40df5fe673.png)

To create the database, we first created a schema, which made it much easier to make changes and check for problems because it was much easier to visualise in the chart than as a physical database. Working as a team was extremely beneficial in this situation. After the original schema was created, it was proposed to other members of the team, with feedback coming in about possible changes to make that would improve database efficiency and better database creation practises. One proposed change was to make the foreign keys integers rather than varchar, resulting in the creation of additional tables for relationships.

This is the very first schema that was developed:

## ![](RackMultipart20220516-1-f0s1ce_html_23055f232c82021d.png)

And the final schema that was made, this is the one the database is based on: ![](RackMultipart20220516-1-f0s1ce_html_21ca2afb9d6e7f31.png)

## Wireframes Developed

As recommended by our Team Managers, we created wireframes as a mock-up of how we expect the website to look. This included some of the features that the backend developers would need to create for, as well as a good idea of what the frontend designers should be designing for. Some of the wireframes we created are shown below.

![](RackMultipart20220516-1-f0s1ce_html_7324e8524d74a29.png)

![](RackMultipart20220516-1-f0s1ce_html_8ea016a0a23b1eab.png)

## Use of Trello to Focus on Tasks

We used the project management system Trello to distribute the tasks between us as a group. To create a task distribution, we had to divide the problem into smaller subproblems to make the work more manageable. To categorise the tasks we had to complete, we used labels. These could be _Frontend_, _Backend_, _Database_, _Planning_, or _Server setup_. To assign people to tasks, we used the join function on Trello cards. Our Gantt chart and wireframes were also displayed on Trello as a constant reminder of what our end goal should look like and how well we were progressing.

## Agile Approach

Development was carried out using an agile approach. The different endpoints we used show how we divided the problem into several subproblem types that could all be worked on separately. Each of these endpoints could then be merged, either individually or collectively, to create a working page for the website. This method allowed us to work on the backend and frontend separately and then connect them later.

For each sub problem we had a deliverable that we intended to meet. For example, once we knew we needed a database, we spent time developing its structure into a format that would work for all of the features we discussed in our requirements.

Each deliverable would continue to build upon the previous one, adding more functionality to the website. As an example, a login page was created, which was then linked with the backend to read from the database and allow users to login if authorised. We then moved on to giving users their own home page; admins don&#39;t need to see a dashboard of problems they&#39;ve submitted because they don&#39;t submit problems. Each of the endpoints listed below is one of the deliverables we created; it was eventually linked to its respective frontend page before the requirement was considered &quot;implemented.&quot; Once all requirements had been met, we had completed our original deliverables; any subsequent deliverables were for bug fixes or enhancements we thought would benefit the users..

## Frontend Design

The frontend pages were designed using the tasks from the Gantt chart. These pages were created as templates that would later be linked to the server&#39;s backend. These were critical for our deliverables because end users would notice more progress on the frontend pages rather than the backend. The frontend pages were created concurrently with their backend counterparts. Each deliverable should result in a front- and backend pair that can be linked together. We were able to start tasks and finish them within our deadlines by doing it this way, rather than starting tasks, moving on to other tasks, and eventually returning to the first task.

## Endpoints Needed

### Employee endpoints

Functionality for getting employees information from the database, this includes their role, department, employee name, extension number, if they&#39;re an external specialist or internal.

It also gives permissions to admins to change certain information about the employees, as an example, an admin might need to update the availability of their employees and so can use this to do that. Initially the backend was created, API requests that would support this, with it later on being connected to a front end page that would be more user friendly.

### Problem endpoints

For the problem endpoints there exists:

- The ability to get all the problems that exist
- The ability to get all outgoing (not closed) problems reported by a particular employee
- The ability to get all outgoing (not closed) problems assigned to a particular specialist
- The ability to submit a new problem
- The ability to edit a problem
- The ability to delete a problem

All of these functions and routes can be found in the _routes/problems.js_ file.

### Equipment endpoints

The Equipment endpoint is organised into four separate javascript files. Each equipment type (Hardware, Software, OS) has its own designated file where the sql queries for interacting with the database are in different functions which return the relevant data. These functions are exported out of the files to be imported and used in the single routing file &#39;equipment.js&#39;.

Each equipment type has similar functions.

- One function to return all the data pertaining to the equipment type
- One function to return all hardware types for hardware equipment, and software types for software equipment
- A function returning the data for the equipment ID inputted.
- Functions for adding new equipment
- Updating an equipment
- Deleting an equipment

All the functions are imported into the &#39;equipment.js&#39; file where the &#39;GET&#39;, &#39;POST&#39;, &#39;PATCH&#39; and &#39;DELETE&#39; routes are. There is a &#39;GET&#39; route which uses the get all data functions and get types functions to display all the data on the &#39;viewEquipment&#39; page. Another &#39;GET&#39; route which uses the get by ID functions and get types functions to display the data pertaining to the ID the user inputs. Both &#39;GET&#39; routes use the functions for all three equipment types (hardware/software/os) as they are all displayed on the same page. A &#39;POST&#39; route for each equipment type to add a new hardware/software/os separately and individually display the added data on a landing page &#39;submittedEquipment&#39;. A &#39;PATCH&#39; route for each equipment to similarly update a row separately and individually display the added data on the landing page. There is also a &#39;DELETE&#39; route for each equipment type as the admin will also handle this separately for each equipment type.

The GET routes allow access to users with the &#39;Admin&#39; role, &#39;Specialist&#39; role and &#39;Employee&#39; whereas the POST, PATCH and DELETE routes are only accessible to users with the &#39;Admin&#39; role. The role of the user is also passed through with the username and the data to be displayed. The role is to make sure any user that is not an &#39;Admin&#39; cannot access the dropdown forms where the equipment can be managed. The POST, PATCH and DELETE routes direct the user to the submitEquipment page taking the data the user submitted in the form and passing it through to be displayed on the submitEquipment page as confirmation. An error in the DELETE routes tells the user that the row cannot be deleted in an alert box in the submit equipment page and then directs them back to the view all equipment page.

### Problem-type endpoints

For the problem type endpoints there exists:

- The ability to get all the problem types that exist
- The ability to get all the children of a problem type
- Get all the specialists who specialise in a problem type
- Remove a problem type that a specialist specialises in
- Create a relation between a specialist and a problem type (they now specialise in that problem type)
- Create a new problem type
- Delete a problem type

Information on how to use these api endpoints can be found in &quot;Problem types endpoints.pdf&quot;. The most critical of these endpoints was the ability to find specialists who specialise in a given problem type. This is used when deciding which specialist a problem should be assigned to. In the list of specialists that are returned it will also return the number of currently assigned problems, from here the lowest numbered specialist can be selected to be given this new problem; this method will prevent unfair distribution of problems between specialists.

### Solution endpoints

Consists of a file with routes (_routes/problem.js_) and supplementing it functions (_utils/problem-utils.js_).

## Testing

Because of the agile approach, testing happened at every stage of the deliverables. The frontend was tested for completeness and usability for the end users, while the backend was tested for validation and accuracy when interacting with the database, such as ensuring foreign keys are removed correctly. Before any deliverable could be considered &quot;ready to go,&quot; it had to be tested as a whole to ensure that the frontend and backend were working properly together, as well as tested by another developer, who could provide a different perspective on things that were not initially considered. The results of this testing were posted to the deliverable&#39;s pull request section on GitHub. In addition to the testing that occurred at the end of each deliverable, there would be periodic testing to ensure that all features were still functional and that the new features added as we progressed through the task did not interfere with our previous work.

After we had completed all of the initial requirements, we conducted the final testing. This included both testing the system as an end user to ensure it meets the client&#39;s requirements and attempting to break the system, such as inserting incorrect data into fields to ensure the system can account for and handle this correctly without crashing the server.

During the testing, we also considered additional features that would expand on the initial requirements we had established. These additional enhancements were added to GitHub under the &quot;issues&quot; tab, but with the tag &quot;enhancement.&quot;

Testing was useful not only for ensuring that all of our features are working properly and cannot be exploited either accidentally or on purpose, but also for discovering new features that we had not previously considered.

## Evaluation

As a team we worked well. We divided the team into frontend and backend design to focus on our strengths. We also had a meeting where we went over all of our previous projects to get ideas and inspiration for features we hadn&#39;t considered before. One of the primary advantages of working as a team is that each team member can bring a unique perspective on how to handle a given requirement. As with the database, the original schema was modified to better reflect best practises based on team feedback.

All of our meetings had 100% attendance, with everyone making valuable contributions. We had extra work to do as a group per person because we were missing a team member. This had no effect on our morale or the final deliverable for Make-It-All; we still included all of the requirements given to us and to a high standard, as well as additional features that we believe will benefit the system&#39;s users.
