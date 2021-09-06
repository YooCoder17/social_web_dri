import { useState } from 'react';

const MessageInput = () => {
  const [text, setText] = useState('');

  return (
    <form className="p-2 bg-gray-100">
      <input
        className="w-full rounded-lg border-pink-500 border focus:ring-pink-600 focus:border-pink-600"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Send a message..."
      />
    </form>
  );
};

export default MessageInput;
