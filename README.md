This is a scalable and automated containerized Deployment Pipleline, leveraging some AWS services...

STEP 1: On the UI, Users will get a Input field wherein they can paste the link for the project's source code they need to deploy and press the deploy button.
![image](https://github.com/user-attachments/assets/1b405dba-c53b-4713-a407-1477bbb3312c)


STEP 2: Now a new task will automatically start running on AWS ECS, which will generate build folder and upload files to AWS S3.
ECS TASK:
![image](https://github.com/user-attachments/assets/a7aef971-ac1f-4a50-8c22-921836ca855c)

Generated Logs :
![image](https://github.com/user-attachments/assets/41b8c797-788c-4c3a-866c-4fbf10adde6c)

Files uploaded to S3:
![image](https://github.com/user-attachments/assets/1d0f48fb-3b76-4197-a166-2b3b05e8e42a)


Step 3: Push the generated logs to Redis Server and using socketIO subscribe to the logs.
![image](https://github.com/user-attachments/assets/2d4cf475-fb60-4b97-ad45-26a79cd78977)


Step 4: Live Deployment
Preview URL for the deployed site :
![image](https://github.com/user-attachments/assets/5a21ce98-aa67-4d87-800f-885fdb211963)

![image](https://github.com/user-attachments/assets/e21605da-bf37-4847-8462-cea7ae5e5362)
