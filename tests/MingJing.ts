/*
Copyright (c) 2022 Yakkhini
MingJing is licensed under Mulan PSL v2.
You can use this software according to the terms and conditions of the Mulan PSL v2.
You may obtain a copy of Mulan PSL v2 at:
         http://license.coscl.org.cn/MulanPSL2
THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
See the Mulan PSL v2 for more details.
*/

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MingJing } from "../target/types/ming_jing";

describe("MingJing", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MingJing as Program<MingJing>;

  it("can post a new jin zhan", async () => {
    const jinzhan = anchor.web3.Keypair.generate();
    await program.methods
      .postJinzhan("Do not bother me.")
      .accounts({
        jinzhan: jinzhan.publicKey,
        author: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([jinzhan])
      .rpc();
  });
});
