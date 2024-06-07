// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "./ERC20.sol";
contract Token  is ERC20{
    address public Owner;
        address public Tom = 0x4c3105F395cd1e99aB4532d5F565dbA21e084b51;
    address public Ben = 0x6D7C0e7bD400d26927049CDF9471078d728f2D46;
    address public Rick = 0xE49700f81e1fC505F75f159746DDc40452e2db99;
    constructor (string memory name, string memory symbol, uint256 initialSupply, address owner) ERC20(name, symbol){
        Owner = owner;
            //Выпуск токена
            mint(Owner, initialSupply * 10 **decimals());
    }
    //Самописная функция для перевода токенов, принимает адрес от кого хотите передать, кому хотите, количество
    //Возвращает в случее успеха true
    function transferTokens(address from, address to, uint256 amount)public returns(bool) {
        _transfer(from, to,amount);
        return true;
    }
    //Самописная функция для выпуска токенов принимает адрес кому на баланс токены попадут, и количество токенов
    function mint(address account, uint256 amount) public  {
        _mint(account,  amount);
    }

   //Функция для выдачи стартовых токенов 3 пользователям Tom,Rick, Ben .принимает количество токенов
    function giveStartTokensToUsers(uint256 amount) external {
       
 transferTokens(Owner, Tom, amount * 10 ** decimals());
        transferTokens(Owner, Ben, amount * 10 ** decimals());
        transferTokens(Owner, Rick, amount * 10 ** decimals());
        
    }
    //Функция для вывода количество десятичных знаков у токена по умолчанию 12, возвращает количество десятичных знаков
    function decimals() public view override  returns(uint8) {
        return 12;
    }
    
    
}