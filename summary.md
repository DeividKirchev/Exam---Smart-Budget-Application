# Project Implementation Summary

### 1. Which tasks you used Claude/Codex for

The whole project was created using Claude and the BMAD method. All tasks (documentation, planning, analysis, implementation) were created using the LLM agents provided from BMAD/Claude.

The only things which were done manually were this summary, checking model outputs (documentation and project preview) and deployment (using documented instructions).

### 2. What output you accepted or modified

Using the BMAD method gave pretty consistent results with minimal need for modification. Almost all outputs were left as-is out of the box.
Modifications were primarily needed after doing manual QA on the project. Bugs/issues were given to the model to fix; no manual coding was done.
Sometimes the agents would not follow the prompts.md file structure or would forget to add the prompts there. Some prompts were fixed manually to match the structure as it is a small task and it would happen faster than waiting for the agent to fix it.

### 3. How AI affected your speed or code quality

Using the AI gradually improved the project implementation speed. Having the agent do all the coding/documentation allowed me to focus more on the product as a whole rather than the implementation itself. Coding/Documentation speed is not comparable - the agent writes code many times faster than me. Even the waiting time is not a lot, and while the agent is working I can review things or focus on other tasks. The time it saves is huge.
The only speed-related problem was having to wait for more usage, but overall the project implementation speed is much faster than doing it manually.

The BMAD method makes sure the code quality is good enough, maybe not as good as a developer doing it, but the time it saves is totally worth a bit of a loss. The results were consistent with no hallucinations. Only minor errors occurred, but were easily fixable with a follow-up prompt.

### 4. What custom settings have you made (if any)

I have added a step in the agent workflow to document all my prompts to prompts.md.
It did not work great and definitely can be improved to correctly follow an output structure and to make sure it doesn't forget, as I had to do manual fixes from time to time.

### 5. What problems you`ve handled during the development

Manual testing revealed some issues mainly with responsiveness; however, that is not something which the agents can easily predict.
Agents weren't always running ***npm test*** and ***npm lint***, causing issues when committing and requiring follow-up prompts.
Initially I had added the rule to document all prompts in the wrong flow place. After a discussion with the BMAD master, it helped me add it in a place where they would always read it and implement it. However, they would still forget sometimes or not follow the document structure.

As it is a rather small project, I decided not to work further towards fixing those issues; however, if the project continues it is definitely something to look into. They sound easy to fix and would save some manual labor and follow-up prompts.