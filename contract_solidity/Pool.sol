// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "./Token.sol";
contract Pool {
    Token FirstToken;
    Token SecondToken;
    Token LPToken;
    uint256 firstTokenPrice;
    uint256 secondTokenPrice;
    string public poolName;
    address public poolOwner;
    constructor (string memory _poolName, address _tokenFirst, address _tokenSecond, uint256 _firstTokenPrice, uint256 _secondTokenPrice, address _lpAddress, address _poolOwner) {
            poolName = _poolName;
            poolOwner = _poolOwner;
            firstTokenPrice = _firstTokenPrice;
            secondTokenPrice = _secondTokenPrice;
            FirstToken = Token(_tokenFirst);
            SecondToken = Token(_tokenSecond);
            LPToken = Token(_lpAddress);
    }
    //Функция для вывода стоимости первого токена в eth возращает стоимость первого токена
    function getFirstTokenPriceEth () internal  view returns(uint256) {
        return  (firstTokenPrice* 1 ether) / 10;
    }
    
  //Функция для вывода стоимости второго токена в eth возращает стоимость второго токена
        function getSecondTokenPriceEth () internal view returns(uint256) {
         return  (secondTokenPrice* 1 ether) / 10;
    }
    //Функция позволяет добавить ликвидность в пул на первый токен, принимает количество первого токена  которое заберется и попадет в пул
    function addFirstTokenLiquidity(uint256 amount, address sender) external {
        FirstToken.transferTokens(sender, address(this), amount * 10 ** FirstToken.decimals());
        LPToken.mint(msg.sender, amount /6 * 10 ** LPToken.decimals());
    }
        //Функция позволяет добавить ликвидность в пул на второй токен, принимает количество второго токена которое заберется и попадет в пул
    function addSecondTokenLiquidity(uint256 amount, address sender) external {
        SecondToken.transferTokens(sender, address(this), amount * 10 ** SecondToken.decimals());
        LPToken.mint(sender, amount /6 * 10 ** LPToken.decimals());
    }
    //Функция для обмена первого токена на второй, принимает количество первого токена  возвращает количество второго токена которое нужно получить
        function tradeFirstToSecond(uint256 firstAmount, address sender) external returns(uint256){
        uint256 secondAmountToNeed  = (firstAmount * getFirstTokenPriceEth() *getSecondTokenReserve() * getSecondTokenPriceEth())
         / (getSecondTokenPriceEth() * getFirstTokenReserve() * getFirstTokenPriceEth());
         
        FirstToken.transferTokens(sender, address(this),firstAmount * 10 ** FirstToken.decimals());
        SecondToken.transferTokens(address(this), sender, secondAmountToNeed * 10 ** SecondToken.decimals());
        return secondAmountToNeed;
    }
        //Функция для обмена второго токена на первый, принимает количество второго токена возвращает количество первого токена которое нужно получить
            function tradeSecondToFirst(uint256 secondAmount,address sender) external  returns(uint256) {
            uint256 firstAmountToNeed  = (secondAmount * getSecondTokenPriceEth() *getFirstTokenReserve() * getFirstTokenPriceEth())
         / (getFirstTokenPriceEth() * getSecondTokenReserve() * getSecondTokenPriceEth());
         
        SecondToken.transferTokens(sender, address(this),secondAmount * 10 ** SecondToken.decimals());
        FirstToken.transferTokens(address(this), sender, firstAmountToNeed * 10 ** FirstToken.decimals());
        return firstAmountToNeed;
    }
    //Функция для получения резерва первого токена возвращает количество первого токена в пуле 
    function getFirstTokenReserve() public view returns (uint256) {
        return FirstToken.balanceOf(address(this));
    }  
    //Функция для получения резерва второго токена возвращает количество второго токена в пуле 
        function getSecondTokenReserve() public view  returns (uint256) {
        return SecondToken.balanceOf(address(this));
    }
}