import React from "react";
import { PrettyChatWindow } from "react-chat-engine-pretty";

export default function ChatsPage(props) {
  return (
    <div className="background">
      <PrettyChatWindow
        projectId="bf009657-4d66-4faf-8ebe-acb6b32bc3bd"
        username={props.user.username}
        secret={props.user.secret}
        style={{ height: "100vh" }}
      />
    </div>
  );
}
