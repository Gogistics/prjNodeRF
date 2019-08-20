# Instruction of running the application

* Environments:
    - Linux/Mac:
        For Linux/Mac users, the code can be executed by 1. and 2.
    - Windows:
        For Windows, the code can be executed by 2.

1. Install Node.js and npm in your environment, go to node-app/, and then run `./infra/scripts/spin_up_app.sh -l`

2. Install Docker, stay in the project root dir and run `./infra/scripts/spin_up_app.sh -d`. Once you are in the container shell, run `node app.js`.

# If the application needs to be implemented as a full-scale web app, what would I do?
I always turn a standalone application into a full-scale application by following steps:

1. (backend) Make the backend application scalable, available to be built by the microservices architecture, available to be smoothly deployed in differernt cloud platforms.
2. Set up load balancers for the web applications running distributedly.
3. (backend) Set up databases to permanently save and temporarily cache the data. Therefore, the data which is saved permanently can be used for analytics in the future and the cached data can be use to speed up the query.
4. Change the way to get sub data of the available food trunks, e.g. store and get data from Redis by GETRANGE. iterator/generator is good for the use case of command-line program not for full-scale web application.
4. (backend) Design the APIs between the backend and the frontend with the following characteristics:
    * Easy to learn and use, even without documentation
    * Easy to read and maintain code that uses it
    * Hard to misuse
    * Sufficiently powerful to satisfy requirements
    * Easy to extend
    * Appropriate to audience
5. (backend) Have a better authentication and security mechanism to prevent hacking or attacking.
6. (backend) Implement the logging mechanism.
7. (frontend) Design the data service layer which is used to fetch data from backend and to be shared by differernt components.
8. (frontend) Improve the frontend performance by building a state management mechanism to cache the data if necessary and implmenting the mechanism debounce.
9. (frontend) Implement the user-friendly UI for users to see the results, e.g. infinite-scrolling table.