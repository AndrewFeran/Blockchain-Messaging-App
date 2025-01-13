# Blockchain Messaging App [WIP]
The goal of this project is to apply blockchain technology to the concept of private messaging and create a messaging app that satisfies three main security requirements: decentralization, immutability, and trustless-nature. Each of these security requirements, how they will be met, and their limitations are discussed in this document. Additionally, there will be a cost/benefit analysis to shed light on the potential applications of a product like this.
## Technical Details
App currently has user signup/login process and the chat system has not been started.
Frontend has minimal design and only exists for functional purposes in this state.
## Decentralization
In order to preserve the integrity of a discussion, it is important that every party is in agreeance on the contents of the discussion. Hence why it is integral that every party involved keep a copy or record of the discussion. However, there isn't anything stopping a party from modifying their record of the discussion and thus causing disagreement over what was said.

This is where blockchain technology comes in. In the context of blockchain, the record is referred to as a ledger. In a blockchain ledger, the validity of each block of data depends fully on the validity of the previous block. What this means, is that if a party attempts to modify one message, it will invalidate every single message sent after the one they modified. This will make it easier for the other parties in the discussion to come to agreement because the longest valid ledger will be accepted as the most accurate.

The downside to this is that the longer a discussion goes on, the more memory intensive it will be for the end-user. Unlike cryptocurrencies, a message-based blockchain cannot be formatted as a Merkle-tree and trimmed appropriately. Instead, it may be necessary to backup older messages into a classic record and remove them from the blockchain. As a result, some older messages in a discussion may no longer be considered resistant to modification (immutable).
## Immutability
Building on some of the ideas discussed when talking about decentralization, it is very important that messages are immutable (i.e. they are unable, or very challenging, to change). There are a couple of different ways to achieve this involving blockchain and signatures.

**Blockchain** offers immutability in the form of a ledger, where every block depends on the last (as discussed in the decentralization section). Of course, utilizing blockchain technology is just the start for immutability.

**Signatures** are a way to ensure that a given message was infact sent by the party the message claims to be from. For computers, cryptography can be applied to obtain a similar effect.
## Trustless-Nature
The system should be trustless, where each message is confirmed by a random third party. This will be accomplished by randomly choosing a connected user to verify each message. This way, it is highly unlikely that a threat actor with knowledge of the a users private key could intercept their message for modification. This means that by default, for a chat of party size n, n+1 users will be required to be connected to the backend in order to "prove" a message.
## Discussion
All this being said, it is obvious that this type of messaging paradigm may not be for everybody. This project is simply a proof of concept that intends to generate further discussion. This sort of messaging app may be most useful where there are minimal trust requirements for users. Additionally, this app stores very little data (only username, verification_hash, and auth_token). So, this app may also be useful in cases where the backend server may not be trusted. However, this kind of messaging app requires much more computing power and storage on the end user's device. Of course, this is impractical for the end user and only worth while in certain scenarios.