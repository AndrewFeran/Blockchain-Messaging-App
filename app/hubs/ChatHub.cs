// Hubs/ChatHub.cs
using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub {
    // keep a dictionary of usernames and their ConnectionId
    private static readonly ConcurrentDictionary<string, string> _connections = new();
    public override Task OnConnectedAsync() {
        var httpContext = Context.GetHttpContext();
        string? username = httpContext?.Request.Headers["Username"];
        if (!string.IsNullOrEmpty(username)) {
            _connections[username ?? ""] = Context.ConnectionId;
        }
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception) {

        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string user, string message, string recipient) {
        // Check if the recipient is the same as the sender
        if (user == recipient) {
            // Optionally handle self-message, e.g., show an error or handle differently
            return;
        }

        // Send the message to the recipient (this is using the user's unique identifier)
        await Clients.All.SendAsync("ReceiveMessage", user, message, recipient);

        if (_connections.TryGetValue(recipient, out var recipientConnectionId))
        {
            await Clients.Client(recipientConnectionId).SendAsync("ReceiveMessage", user, message);
        }
        else
        {
            // Optionally, notify the sender that the recipient is not online
            await Clients.Caller.SendAsync("ReceiveMessage", "System", "Recipient is not online.");
        }
    }
}