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

use anchor_lang::prelude::*;

/// constents
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;
const MAX_CONTENT_LENGTH: usize = 280 * 4;

declare_id!("5q1C1Xk4d45nEsNFR19ZXwjXFKZgKkSpkDy1yH8hQwFZ");

#[program]
pub mod ming_jing {
    use super::*;

    pub fn post_jinzhan(ctx: Context<PostJinZhan>, content: String) -> Result<()> {
        let jinzhan = &mut ctx.accounts.jinzhan;
        let author = &ctx.accounts.author;
        let clock = Clock::get().unwrap();

        Ok(())
    }
}

/// instruction to post a Jin Zhan.
#[derive(Accounts)]
pub struct PostJinZhan<'info> {
    #[account(init, payer = author, space = JinZhan::LEN)]
    pub jinzhan: Account<'info, JinZhan>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Jin Zhan is basic post on Ming Jing, like Tweet on Twitter or Weibo.
#[account]
pub struct JinZhan {
    pub author: Pubkey,
    pub timestamp: i64,
    pub content: String,
}

impl JinZhan {
    /// space of a Jin Zhan need.
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp
        + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH; // Content.
}
