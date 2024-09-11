# Term Finance Gas Cost Analysis

Simple gas cost analysis of Term Finance average gas cost over the [last 30 auctions](./last-30-auctions.json), compared to a fixed-cost ZK-based design.

Install dependencies:
```bash
    npm install
```

Run the gas cost analysis:
```bash
    node main.js
```

Current results at time of writing:
```
    Total auction cumulative gas cost: 38065756 gas
    Proposed version cumulative gas cost: 10500000 gas; Average cost reduction: 72.42%
```

