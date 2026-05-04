import { toast } from "@/components/ui/use-toast";

type MessageCallback = (data: any) => void;

export class EyeTrackingService {
  private socket: WebSocket | null = null;
  private clientId: string | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnected = false;
  private apiBaseUrl: string;

  constructor() {
    // Use environment variable or default to local development URL
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'https://devops-x0lk.onrender.com';
  }

  // Initialize WebSocket connection
  public async initialize(): Promise<string> {
    try {
      // Get a unique client ID from the server
      const response = await fetch(`${this.apiBaseUrl}/api/client-id`);
      const data = await response.json();
      this.clientId = data.client_id;
      
      // Connect to WebSocket
      this.connect();
      return this.clientId;
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      throw error;
    }
  }

  // Connect to WebSocket
  private connect() {
    if (!this.clientId) {
      console.error('Client ID not set. Call initialize() first.');
      return;
    }

    // Close existing connection if any
    this.disconnect();

    // Create new WebSocket connection
    const wsUrl = this.apiBaseUrl.replace('http', 'ws') + `/ws/eye-tracking/${this.clientId}`;
    this.socket = new WebSocket(wsUrl);

    // Connection opened
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      toast({
        title: "Connected",
        description: "Eye tracking is now active",
      });
    };

    // Listen for messages
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyCallbacks(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Handle connection close
    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      this.isConnected = false;
      
      // Attempt to reconnect
      this.handleReconnect();
    };

    // Handle errors
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };
  }

  // Handle reconnection logic
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff with max 30s
      
      console.log(`Attempting to reconnect in ${delay}ms... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      
      toast({
        title: "Connection lost",
        description: "Unable to reconnect to the eye tracking service",
        variant: "destructive",
      });
    }
  }

  // Send a frame for analysis
  public sendFrame(frameData: string): void {
    if (!this.isConnected || !this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    try {
      const message = {
        type: 'frame',
        image: frameData,
        timestamp: Date.now()
      };
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  }

  // Register a callback for WebSocket messages
  public onMessage(callback: MessageCallback): void {
    if (!this.messageCallbacks.includes(callback)) {
      this.messageCallbacks.push(callback);
    }
  }

  // Remove a callback
  public offMessage(callback: MessageCallback): void {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  // Notify all registered callbacks
  private notifyCallbacks(data: any): void {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in message callback:', error);
      }
    });
  }

  // Disconnect WebSocket
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.isConnected = false;
  }

  // Check if connected
  public isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

// Create a singleton instance
export const eyeTrackingService = new EyeTrackingService();

// Export a hook for React components
export const useEyeTracking = () => {
  return {
    initialize: eyeTrackingService.initialize.bind(eyeTrackingService),
    sendFrame: eyeTrackingService.sendFrame.bind(eyeTrackingService),
    onMessage: eyeTrackingService.onMessage.bind(eyeTrackingService),
    offMessage: eyeTrackingService.offMessage.bind(eyeTrackingService),
    disconnect: eyeTrackingService.disconnect.bind(eyeTrackingService),
    isConnected: eyeTrackingService.isConnectedToServer.bind(eyeTrackingService)
  };
};
