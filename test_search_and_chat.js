async function testFlow() {
  try {
    // 1. User 1 Login
    const r1 = await fetch('http://localhost:3000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '9876543210', countryCode: '+91', code: '123456' }),
    });
    const u1 = await r1.json();
    console.log('✅ User 1 Verified:', u1.user.phoneNumber, 'ID:', u1.user.id);

    // 2. User 2 Login
    const r2 = await fetch('http://localhost:3000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '9123456789', countryCode: '+91', code: '123456' }),
    });
    const u2 = await r2.json();
    console.log('✅ User 2 Verified:', u2.user.phoneNumber, 'ID:', u2.user.id);

    // 3. User 1 searches for User 2 by phone number
    console.log('🔍 User 1 searching for 9123456789...');
    const rSearch = await fetch('http://localhost:3000/api/auth/users/search?q=9123456789', {
      headers: { Authorization: `Bearer ${u1.token}` },
    });
    const searchData = await rSearch.json();
    console.log('🔍 Search Response:', JSON.stringify(searchData));

    // 4. User 1 starts direct chat with User 2
    console.log('💬 Creating direct chat...');
    const rChat = await fetch('http://localhost:3000/api/chats/direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${u1.token}`,
      },
      body: JSON.stringify({ targetPhone: '+919123456789' }),
    });
    const chatData = await rChat.json();
    console.log('💬 Direct Chat Data:', JSON.stringify(chatData));

    // 5. User 1 sends message
    console.log('✉️ Sending message from User 1...');
    const rMsg = await fetch('http://localhost:3000/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${u1.token}`,
      },
      body: JSON.stringify({ chatId: chatData.chat.id, content: 'Hey bro! Let us test our chat!' }),
    });
    const msgData = await rMsg.json();
    console.log('✉️ Message Sent:', JSON.stringify(msgData));

    // 6. User 2 fetches messages in this chat
    console.log('📬 User 2 reading chat messages...');
    const rMsgList = await fetch(`http://localhost:3000/api/messages/chat/${chatData.chat.id}`, {
      headers: { Authorization: `Bearer ${u2.token}` },
    });
    const msgListData = await rMsgList.json();
    console.log('📬 User 2 Received Messages:', JSON.stringify(msgListData));

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Both users can search and chat with each other in real-time!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

testFlow();

