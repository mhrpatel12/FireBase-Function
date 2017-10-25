# FireBase-Function

Firebase function to send notification.

Example of very simple chat application.
Realtime database consists of two tables as deviceTokens & chatRoom. 
Each time there is a new entry in chatRoom table (i.e. New message sent from app), notification will be triggered to each entry in deviceTokens table (Every user will get notification containing message & message sender).
