interface Edge {
  node: string;
  weight: number;
}

interface Transaction {
  payer: string;
  receiver: string;
  amount: number;
}

interface Balances {
  [key: string]: number;
}

class DirectedGraph {
  adjList: { [key: string]: Edge[] };

  constructor() {
    this.adjList = {};
  }

  addVertex(vertex: string): void {
    if (!this.adjList[vertex]) {
      this.adjList[vertex] = [];
    }
  }

  addEdge(source: string, destination: string, weight: number): void {
    this.addVertex(source);
    this.addVertex(destination);
    this.adjList[source].push({ node: destination, weight: weight });
  }

  getBalances(): Balances {
    let balances: Balances = {};

    for (let source in this.adjList) {
      if (!balances[source]) {
        balances[source] = 0;
      }

      for (let edge of this.adjList[source]) {
        let destination = edge.node;
        let weight = edge.weight;

        if (!balances[destination]) {
          balances[destination] = 0;
        }

        balances[source] -= weight;
        balances[destination] += weight;
      }
    }

    return balances;
  }
}

class SplitManagerService {
  transactions: Transaction[];
  graph: DirectedGraph;

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
    this.graph = new DirectedGraph();
    this.setGraphEdges();
  }

  private setGraphEdges(): void {
    this.transactions.forEach((transaction) => {
      const { payer, receiver, amount } = transaction;
      this.graph.addEdge(payer, receiver, amount);
    });
  }

  settleBalances(): Transaction[] {
    let balances = this.graph.getBalances();
    let settlement = true;
    let settlements: Transaction[] = [];

    for (let source in balances) {
      for (let destination in balances) {
        if (balances[source] < 0 && balances[destination] > 0) {
          const amount = Math.min(-balances[source], balances[destination]);
          balances[source] += amount;
          balances[destination] -= amount;
          settlements.push({
            payer: destination,
            receiver: source,
            amount,
          });
          settlement = false;
        }
      }
    }

    if (settlement) {
      return [];
    }

    return settlements;
  }
}

export default SplitManagerService;
