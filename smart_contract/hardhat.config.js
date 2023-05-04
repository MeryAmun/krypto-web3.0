// https://eth-sepolia.g.alchemy.com/v2/lDQxQsG7rSxXfhdZpP9P1CeMB2d5UfJT

require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity: '0.8.0',
  networks:{
    sepolia:{
      url:'https://eth-sepolia.g.alchemy.com/v2/lDQxQsG7rSxXfhdZpP9P1CeMB2d5UfJT',
      accounts:['431be59e00dce596f60fa962c54c381fa0fb2d38af69ed12225d02e05a2d4e41']
    }
  }
}