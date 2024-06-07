// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "./Pool.sol";
contract Router {
    address public Owner;
    Pool GerdaKrendel;
    Pool KrendelRtk;
    constructor (address gerdaKrendel, address krendelRtk) {
        GerdaKrendel = Pool(gerdaKrendel);
        KrendelRtk = Pool(krendelRtk);
    }
    //Функция для обмена токена GERDA на RTK, принимает количество gerda которое хотите отдать
    function changeGerdaToRTK(uint256 gerdaAmount, address sender) public {
    uint256 krendelAmount =  GerdaKrendel.tradeFirstToSecond(gerdaAmount, sender);
    KrendelRtk.tradeFirstToSecond(krendelAmount, sender);
    }

    //Функция для обмена токена RTK на GERDA, принимает количество RTK которое хотите отдать
        function changeRTKToGerda(uint256 RTKAmount, address sender) public {
    uint256 krendelAmount =  KrendelRtk.tradeSecondToFirst(RTKAmount, sender);
    GerdaKrendel.tradeSecondToFirst(krendelAmount, sender);
    }
}