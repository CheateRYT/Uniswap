// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "./Token.sol";
import "./Pool.sol";
import "./Stacking.sol";
import "./Router.sol";
contract Factory {
    address public Owner;
    address public Tom = 0x4c3105F395cd1e99aB4532d5F565dbA21e084b51;
    address public Ben = 0x6D7C0e7bD400d26927049CDF9471078d728f2D46;
    address public Rick = 0xE49700f81e1fC505F75f159746DDc40452e2db99;
    Token public Gerda;
    Token public Krendel;
    Token public RTK;
    Token public Profi;
    Pool public GerdaKrendel;
    Stacking public stacking;
    Router public router;
    Pool public KrendelRTK;
    uint256 private gerdaKrendelRatio = 1500;
    uint256 private KrendelRTKRatio = 3000;
    uint256 private gerdaPrice = 10;
    uint256 private krendelPrice = 15;
    uint256 private RTKprice = 30;
    address[] public Pools;
    mapping (address => string) users;
    constructor () {
        users[Owner] = "Owner";
         users[Tom] = "Tom";
          users[Ben] = "Ben";
           users[Rick] = "Rick";
            Owner = msg.sender;
            //Создание контрактов токенов
            Gerda = new Token("GerdaCoin", "GERDA", 100000, Owner);
            Krendel = new Token("KrendelCoin", "KRENDEL", 150000,Owner);
            RTK = new Token("RTKCoin", "RTK", 300000,Owner);
            Profi = new Token("Professional", "PROFI", 0,Owner);


            //Создание контактов пулов
            GerdaKrendel = new Pool("Gerda-Krendel",address(Gerda),  address(Krendel), gerdaPrice, krendelPrice, address(Profi), Tom);
            KrendelRTK = new Pool("Krendel-RTK",address(Krendel),  address(RTK), krendelPrice, RTKprice, address(Profi), Ben);

            //Создание контракта стейкинга
            stacking = new Stacking(address(Profi));


            //Добавляю в пулы стартовое количество ликвидности по соотношению
            Gerda.mint(address(GerdaKrendel), (gerdaKrendelRatio * 1 ether / (gerdaPrice * 1 ether / 10))  * 10 ** Gerda.decimals());
            Krendel.mint(address(GerdaKrendel), (gerdaKrendelRatio  * 1 ether  / (krendelPrice * 1 ether / 10))  * 10 ** Krendel.decimals());
            Krendel.mint(address(KrendelRTK), (KrendelRTKRatio *  1 ether / (krendelPrice  * 1 ether/ 10))  * 10 ** Krendel.decimals());
            RTK.mint(address(KrendelRTK), (KrendelRTKRatio  *   1 ether  / (RTKprice  * 1 ether / 10)) * 10 ** RTK.decimals());

            //Создание контракта router
            router = new Router(address(GerdaKrendel), address(KrendelRTK));

            Pools.push(address(GerdaKrendel));
            Pools.push(address(KrendelRTK));

    }
    //Функция для возвращения имени пользователя по адресу
    function returnUserName(address userAddr) external view returns(string memory) {
        return users[userAddr];
    }
    //Функция для создания пула принимает имя пула желательно чтобы было  в формате "Gerda-Krendel" , адрес первого токена и адрес второго токена
    //какие хотите чтобы менялись, цена первого и второго токена в формате чтобы подходила для деления на 10, адрес лп токена профи, стартовое соотношение в eth
    //На выходе создается новый пул
    function createPool(string memory poolName, address firstTokenAddress, address secondTokenAddress,uint256 firstTokenPrice, uint256 secondTokenPrice, address lpAddress, uint256 startingEthRatio) public {
        Pool newPool = new Pool(poolName, firstTokenAddress, secondTokenAddress, firstTokenPrice, secondTokenPrice, lpAddress, msg.sender);
        Token firstToken = Token(firstTokenAddress);
        Token secondToken = Token(secondTokenAddress);
           firstToken.mint(address(newPool), (startingEthRatio * 1 ether / (firstTokenPrice * 1 ether / 10))  * 10 ** firstToken.decimals());
           secondToken.mint(address(newPool), (startingEthRatio * 1 ether / (secondTokenPrice * 1 ether / 10))  * 10 ** secondToken.decimals());
           Pools.push(address(newPool));
    }

    //Функция позволяет распределить какое то количество стартовых токенов нашим пользователям,  от Owner, принимает количество токенов, вызывает методы из интерфейса Token 
    function giveStartTokensToUsers(uint256 amount) public {
        Gerda.giveStartTokensToUsers(amount);
        Krendel.giveStartTokensToUsers(amount);
        RTK.giveStartTokensToUsers(amount);
    }

    //Функция геттер для получения массивов адресов пулов
    function getAllPoolsAddress() external view returns(address[] memory) {
        return Pools;
    }


    //Функция для показа баланса пользователя который не лежит на стейкинге, возвращает число токенов
    function showNonStackedTokens() external  view returns(uint256) {
        return stacking.showNonStackedTokens(msg.sender);
    }
     //Функция для того чтобы положить лп токены на стейкинг контракт, принимает количество токенов
    function putLPProfi(uint256 amount) external {
        stacking.putLPProfi(amount, msg.sender);
    }
    //Функция для получения имени пула по адресу
    function getPoolName(address  poolAddress) external view returns(string memory) {
        Pool pool = Pool(poolAddress);
        return pool.poolName();
    } 
    //Функция для получения адреса владельца пула по адресу пула
    function getPoolOwner(address poolAddress) external view returns(address) {
        Pool pool = Pool(poolAddress);
        return pool.poolOwner();
    }
    //Функция для забирания награды со стейкинга
    function takeReward() external {
        stacking.takeReward(msg.sender);
    }
    //Функция позволяет добавить ликвидность в пул на первый токен, принимает количество первого токена  которое заберется и попадет в пул
    function addFirstTokenLiquidity(address poolAddress, uint256 amount) external {
            Pool pool = Pool(poolAddress);
            pool.addFirstTokenLiquidity(amount,msg.sender);
    }
        //Функция позволяет добавить ликвидность в пул на второй токен, принимает количество второго токена которое заберется и попадет в пул
   function addSecondTokenLiquidity(address poolAddress, uint256 amount) external {
            Pool pool = Pool(poolAddress);
            pool.addSecondTokenLiquidity(amount,msg.sender);
    }

        //Функция для получения количество лп токенов на стейкинге
    function getValueAllStackingLP() external view returns(uint256) {
        return stacking.getValueAllStackingLP();
    }
    //Функция для того чтобы забрать свои лп токены со стейкинга
    function returnMyStack() external {
        stacking.returnMyStack(msg.sender);
    }
    //Функция для обмена токенов
    function tradeFirstToSecond(address poolAddress, uint256 amount, address sender) external returns (uint256) {
        Pool pool = Pool(poolAddress);
        return pool.tradeFirstToSecond(amount, sender);
    }
    //Функция для обмена токенов
    function tradeSecondToFirst(address poolAddress, uint256 amount, address sender) external returns (uint256) {
        Pool pool = Pool(poolAddress);
        return pool.tradeSecondToFirst(amount, sender);
    }
    //Функция для получения  резерва первого токена
    function getFirstTokenReserve(address poolAddress) external view returns (uint256) {
        Pool pool = Pool(poolAddress);
        return pool.getFirstTokenReserve();
    }
        //Функция для получения  резерва второго токена
    function getSecondTokenReserve(address poolAddress) public view returns (uint256) {
        Pool pool = Pool(poolAddress);
        return pool.getSecondTokenReserve();
    }
    
//Функция для получения баланса токена, по адресу токена
    function getBalance(address tokenAddress) external view returns(uint256) {
        Token token = Token(tokenAddress);
        return token.balanceOf(msg.sender);
    }

    //Функция для обмена токена gerda на rtk в роутере, принимает количество gerda для обмена
    function changeGerdaToRTK(uint256 gerdaAmount) external {
        router.changeGerdaToRTK(gerdaAmount, msg.sender);
    }
    //Функция для обмена токена RTK на Gerda в роутере, принимает количество RTK для обмена
    function changeRTKToGerda(uint256 RTKAmount) external {
        router.changeRTKToGerda(RTKAmount, msg.sender);
    }
 //Функция для возврата количества токенов которые пользователь положил на стейк
    function getMyStackingBalance() external view returns (uint256) {
        return stacking.getMyStackingBalance(msg.sender);
    }
}