### Weather - Example Mira App

[![Codeship Status for mirainc/mira-app-integration-tests-example](https://app.codeship.com/projects/993bcae0-2728-0137-5fbe-2a710956fdda/status?branch=staging)](https://app.codeship.com/projects/330552)

Display local weather conditions.

#### Presentation Properties

| Name       | Type        | Description                                           |
| ---------- | ----------- | ----------------------------------------------------- |
| `city`     | `string`    | The city to fetch local weather data.                 |
| `units`    | `selection` | Display current temperature in `imperial` or `metric` |
| `duration` | `number`    | The display time in seconds.                          |

#### Commands

The following commands can be run from the project directory.

* `npm start`: Run the local simulator
* `npm run build`: Build the app for deployment
* `npm run deploy`: Deploy the app to the dashboard
* `npm run static`: Build the app with the simulator
* `npm run deploy-static`: Deploy the static build to netlify
* `npm run test:integration`: Run integration tests (must run `npm run static` first)
