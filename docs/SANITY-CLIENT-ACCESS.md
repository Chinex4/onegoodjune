# ONEGOODJUNE: give your client access to Sanity Studio

Your GitHub login belongs to your own Sanity account. Your client can join the same project using their own account and email address; they do not need access to your GitHub account or repository.

## 1. Find the correct project

Open [Sanity Manage](https://www.sanity.io/manage) and sign in with **GitHub**, using the account you used for this project. Select the project's existing Sanity project.

If you have several projects, match the project ID against `NEXT_PUBLIC_SANITY_PROJECT_ID` in your local `.env` or your hosting environment. The application reads that variable in `src/sanity/env.ts`. Do not create a second project or dataset for the client.

## 2. Invite your client's email

1. In the selected project, open **Members** (under **Access** if your dashboard groups it there).
2. Choose **Invite members** or the invitation action shown there.
3. Enter the email address your client will use for their Sanity account.
4. Select a role, checking the available roles and seat costs in your project's current plan.
5. Send the invitation and ask the client to open the invitation email.

For writing and publishing content, choose **Editor** if your plan includes it. Sanity currently lists Editor on Growth and Enterprise. **Viewer** cannot edit or publish. On Free, the available content-editing option may be **Administrator**, which also grants broad project control; use it only if that level of access suits the client, or choose a plan with Editor access. For a client taking over management of the project itself, Administrator is appropriate.

See Sanity's [roles guide](https://www.sanity.io/docs/user-guides/roles) and [current plans](https://www.sanity.io/pricing) before choosing a paid seat.

## 3. Have the client accept and sign in

1. The client opens the invitation link and signs in or creates their own Sanity account using the invited email address.
2. They finish accepting the invitation.
3. They open **`/studio` on this project's deployed website**, for example `https://onegoodjune.com/studio` if that is your live domain. For local development, use `http://localhost:3000/studio`.
4. They sign in with the **same method and account used to accept the invitation**.

They can choose their own supported sign-in method; your GitHub choice does not force them to use GitHub. However, GitHub, Google, and email/password logins can create separate Sanity accounts even when the email address matches. Switching methods afterward does not carry membership across. Sanity explains this in [account recovery](https://www.sanity.io/docs/help/account-recovery).

## 4. Confirm that access works

Check that the client appears as an accepted member in Sanity Manage. Ask them to open Studio and verify that existing content is visible. They can create a draft to check editing access without publishing it. Publishing should be a deliberate action after reviewing the content.

This Studio includes authors, articles, categories, tags, events, and **Editorial selections**. Editorial selections controls the magazine's featured content. Static website copy, payment registrations, and payment settings are managed separately; a Sanity invitation gives access to Sanity content.

No code change, deployment, shared password, or API write token is required just to invite a member to the already configured project.

## Troubleshooting

- **You cannot find the project:** sign out and sign back in using your original GitHub login. Compare the project ID with `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- **You cannot invite members:** check your project permissions with an administrator.
- **The client has no invitation:** check the spelling and spam folder, then resend the invitation from the project's membership screen.
- **The client sees no access after accepting:** check their listed role and which account/sign-in method they used. Try a private browser window. If membership belongs to the wrong account, have an administrator remove that membership and send a new invitation for the intended account.
- **The client can read but cannot edit:** check that they have Editor or Administrator access rather than Viewer.
- **Studio cannot connect or authentication fails:** in the project's API/CORS settings, allow the exact website origin (such as `https://onegoodjune.com`) with credentials enabled. Origins contain the scheme and hostname, not `/studio`. Add your actual deployment origin and localhost separately as needed.
- **Studio says Sanity is not connected:** configure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in the environment serving the app, then restart locally or redeploy. The dataset defaults to `production` in this project.

Keep your own administrator access until the client's access has been verified. Adding a member does not transfer project ownership or billing responsibility.
