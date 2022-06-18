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
import { assert } from "chai";
import { MingJing } from "../target/types/ming_jing";

describe("MingJing", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MingJing as Program<MingJing>;

  it("can post a new jin zhan", async () => {
    const jinZhan = anchor.web3.Keypair.generate();
    await program.methods
      .postJinzhan("Do not bother me.")
      .accounts({
        jinzhan: jinZhan.publicKey,
        author: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([jinZhan])
      .rpc();
  });

  it("can post a new jin zhan with another author.", async () => {
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(
      otherUser.publicKey,
      1000000000
    );
    await program.provider.connection.confirmTransaction(signature);
    const jinZhan = anchor.web3.Keypair.generate();
    await program.methods
      .postJinzhan("PLZ just stay by my side I'm really upset.")
      .accounts({
        jinzhan: jinZhan.publicKey,
        author: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([otherUser, jinZhan])
      .rpc();
    const jinZhanAccount = await program.account.jinZhan.fetch(
      jinZhan.publicKey
    );

    assert.equal(
      jinZhanAccount.author.toBase58(),
      otherUser.publicKey.toBase58()
    );
    assert.equal(
      jinZhanAccount.content,
      "PLZ just stay by my side I'm really upset."
    );
    assert.ok(jinZhanAccount.timestamp);
  });

  it("cannot provide a Jin Zhan with more than 280 characters", async () => {
    try {
      const jinZhan = anchor.web3.Keypair.generate();
      const contentWith281Chars = "v".repeat(281);
      await program.methods
        .postJinzhan(contentWith281Chars)
        .accounts({
          jinzhan: jinZhan.publicKey,
          author: anchor.AnchorProvider.env().wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([jinZhan])
        .rpc();
    } catch (error) {
      assert.equal(
        error.error.errorMessage,
        "This jin zhan has too much characters."
      );
      return;
    }

    assert.fail(
      "Post instruction would fail with a 281-character content Jin Zhan"
    );
  });

  it("can fetch all Jin Zhan.", async () => {
    const jinZhanAccounts = await program.account.jinZhan.all();
    assert.equal(jinZhanAccounts.length, 2);
  });

  it("can filter Jin Zhan by author", async () => {
    const authorPublicKey = anchor.AnchorProvider.env().wallet.publicKey;
    const jinZhanAccounts = await program.account.jinZhan.all([
      {
        memcmp: {
          offset: 8,
          bytes: authorPublicKey.toBase58(),
        },
      },
    ]);

    assert.equal(jinZhanAccounts.length, 1);
    assert.ok(
      jinZhanAccounts.every((jinZhanAccount) => {
        return (
          jinZhanAccount.account.author.toBase58() ===
          authorPublicKey.toBase58()
        );
      })
    );
  });
});
