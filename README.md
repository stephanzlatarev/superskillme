# superskillme

The main components of the application are:
  * The facility is where the agents meet and help the user master skills
  * The plan is the phase in which the user refines their long-term goals and agents help him with building his schedule and workouts
  * The practice is the phase in which the user improves particular skills and agents help him with running the workout and assessing his fitness levels
  * The skill is where the catalogue of skills are found
  * The user is where the information about the user - his plans, schedules, fitness - is found

## Components

### Hub (infra)
All agents are singletons and they interact with each other and with the rooms only through this hub

### Trainer (agent)
The trainer updates the routine on the plan and fitness of the user

### Fitness (data)
### Routine (data)
### Workout (data)

## Miscellaneous

### Naming conventions

Javascript classes have suffixes that show the type of component:
  * Data suffix means this is a data object storing information, e.g. Schedule.data.js, Skill.data.js
  * Agent suffix means this is an agent that helps the user in some way, e.g. Coach.agent.js, Trainer.agent.js
  * Room suffix means this is a place where the user interacts with data and agents, e.g. 
  * Infra suffix means this is a place where agents interact with data and other agents, e.g. Hub.infra.js, Refresher.infra.js
