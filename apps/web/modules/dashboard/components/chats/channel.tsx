import {
  MessageInput,
  MessageList,
  Channel as StreamChatChannel,
  Thread,
  Window
} from "stream-chat-react";

export const Channel = () => (
  <StreamChatChannel>
    <Window>
      {/* <ChannelHeader /> */}
      <MessageList />
      <MessageInput focus />
    </Window>
    <Thread />
  </StreamChatChannel>
);
