# Kindling — co-founder matching platform

A static web app for an entrepreneurship community. It does two things:

1. **Collect and tag members.** People add a profile (school, program level, business / non-business, technical / non-technical, interests, skills, projects, publications, internships). In the **Admin · Tags** view, staff can tag each person (Undergrad / Graduate / MBA / PhD, Business, Technical) and add custom ★ highlight tags so a profile reads at a glance without the long bio.
2. **Match.** A new user enters who they are and who they want. Kindling scores everyone in the database and shows the **top 3**, each with a % score and the reasons. It also builds searches on LinkedIn, Google, Google Scholar and GitHub to look for people outside the database.

## How matching works (`js/match.js`)

| Component | Weight | What it measures |
|---|---|---|
| Fits what you want | 40% | Their background, technical tag and skills vs. what you asked for |
| Wants someone like you | 20% | The same check in reverse — is the interest mutual? |
| Shared vision | 25% | Overlap in interest areas + TF-IDF similarity of bios, projects and publications |
| Complementary skills | 15% | Rewards low skill overlap, so you find someone who covers your gaps |

## Run locally

Open `index.html` in a browser — no build step.

## Data

Profiles are stored in the browser (`localStorage`) so the site runs on GitHub Pages with no server. Use **Export / Import JSON** in the Admin view to move the database between machines. To use a shared hosted database, swap the functions in `js/store.js` for Supabase or Firebase calls.

The profiles marked **Sample** are fictional demo data. Use **Reset to sample data** to restore them.

## Deploy to GitHub Pages

Repo → Settings → Pages → Deploy from branch → `main` / root.
