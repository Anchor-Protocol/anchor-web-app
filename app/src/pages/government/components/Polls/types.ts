export interface Poll {
  id: number;
  type: string;
  status: 'In Progress' | 'Passed' | 'Rejected' | 'Executed';
  title: string;
  vote: {
    total: number;
    yes: number;
    no: number;
  };
  endsIn: Date;
}

export interface PollList {
  polls: Poll[];
  onClick: (poll: Poll) => void;
}
