const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SupModule", (m) => {
    const supp = m.contract("SupplyChain");
    return { supp };
});