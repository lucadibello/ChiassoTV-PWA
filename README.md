# ChiassoTV.ch - A Swiss cultural web TV

![alt text](https://chiassotv.ch/application/assets/img/logo/logo.png "Logo Title Text 1")

# Technologies used



## Front-end
The application's front-end (aka *Client*) is fully written using Vue CLI 4.4.6. I started the development of this new version of ChiassoTV starting from the PWA boilerplate provided by Vue CLI. 

This boilerplate has already a configured ServiceWorker, usefull to cache files (or entire pages). [lern more....](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

The HTTP request are sent to the REST APIs using Axios (a promise-based HTTP client for JavaScript)

## Back-end

The application's back-end is fully written in NodeJS, using the famous ExpressJS framework.

The front-end interacts with the server-side of the application using a series of REST APIs. These APIs are used to read and write data to the MySQL database. This operations are managed by Sequelize ORM:

> Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

Using [ProcessManager2](https://pm2.io/) the back-end's NodeJS application is started in cluster mode (with 8 clusters, 1 per thread).

> The cluster mode allows networked Node.js applications (http(s)/tcp/udp server) to be scaled across all CPUs available, without any code modifications. This greatly increases the performance and reliability of your applications, depending on the number of CPUs available. Under the hood, this uses the Node.js cluster module such that the scaled application’s child processes can automatically share server ports. To learn more, see How It Works in the official Node.js documentation on the cluster module.
> - https://pm2.keymetrics.io/docs/usage/cluster-mode/

# Hosting
The website's back-end is currently hosted in a separated server.

|  **System**       |            |   
| ------------- |:-------------:|
| OS | Ubuntu Server 18.04 (LTS) |
| RAM | 64 GB |
| CPU | Intel(R) Xeon(R) CPU E5-2640 v2 @ 2.00GHz x16 |
| **Used softwares** | |
| Node.js | v10.19.0 |
| PM2 (ProcessManager2)| v4.4.0 |
| Docker (MySQL server)| v19.03.8 |

# Additional notes
