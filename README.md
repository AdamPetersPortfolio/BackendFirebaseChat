# BackendFirebaseChat

Implements the backend for a fully function, JavaScript chatting app using firebase. Authentication, login, conversation creation, and messaging are all implemented in this repository. The following code was used for a Web Design (comp20) final in which users were connected to others with a similar music taste.

# Database Architecture
Users:
 * UserID1:
    * DisplayName: treehugger1
    * Favorite Artists: [Artists1, Artist2, ….]
    * Favorite Songs: [Song1, Song2, ….]
    * Conversations: [ConversationID1, ConversationID2]
    
Conversations
 * ConversationID1 
   * Name: "Group chat 1"
   * Messages:
      * MessageID1:
         * Text: "Hello world"
         * Timestamp: "2:11 PM 1/3/2021"
         * DisplayName: DisplayName1

![](https://github.com/AdamPetersPortfolio/BackendFirebaseChat/blob/main/ChatApp.png)
