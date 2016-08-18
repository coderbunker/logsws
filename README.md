# logsws

## setup database

Setup notification on changes to database:

```
CREATE OR REPLACE FUNCTION systemevents_notify() RETURNS trigger AS $$ BEGIN PERFORM pg_notify('systemevents', row_to_json(NEW)::text); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER systemevents_insert AFTER INSERT ON systemevents FOR EACH ROW EXECUTE PROCEDURE systemevents_notify();
```

## Setup app user

```
CREATE ROLE app NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT LOGIN;
GRANT ALL PRIVILEGES ON DATABASE rsyslogpgsql to app;
GRANT SELECT ON TABLE systemevents to app;
ALTER ROLE app PASSWORD 'YOURPASSWORD';
```

Test connection with username:

```
psql -U app -h localhost -W rsyslogpgsql
```

## Test using an host / VM

Forward port 5432 to your host machine

Change postgresql configuration to listen to all IP addresses and allow connections from 0.0.0.0/0

Test that you can connect to the database using pgadmin3

## Running the app

Configure by creating a config.js file:

```
module.exports = {
  "port": 8000,
  "pgdb": "postgres://app:USER_PASSWORD@localhost/rsyslogpgsql"
}
```

Run the sample logsws/listen.js application 

## Test from the web browser client

In Chrome developer console:

```
var ws = new WebSocket('ws://localhost:8000/hello');
ws.onmessage = function(evt) {console.log(JSON.parse(evt.data)); };
```