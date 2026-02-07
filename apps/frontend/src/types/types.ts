export interface Message  {
    userName: string,
    avatar: {
      seed: string,
    }
    content: any,
    id: string,
    userId: string,
    roomId: string,
    timestamp: number,
}
