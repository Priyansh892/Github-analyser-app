const BASE = "https://api.github.com";
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  location: string | null;
  blog: string | null;
}

export async function getUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${BASE}/users/${username}`, { headers });
  if (!res.ok) throw new Error("User not found");
  return (await res.json()) as GitHubUser;
}

export async function getRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${BASE}/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
      { headers },
    );
    if (!res.ok) throw new Error("Could not fetch repos");

    const pageRepos = (await res.json()) as GitHubRepo[];
    repos.push(...pageRepos);

    if (!Array.isArray(pageRepos) || pageRepos.length < 100) break;
    page += 1;
  }

  return repos;
}

export async function getLanguages(repos: GitHubRepo[]) {
  return repos.reduce((merged, repo) => {
    if (!repo.language) return merged;
    merged[repo.language] = (merged[repo.language] || 0) + 1;
    return merged;
  }, {} as Record<string, number>);
}

export async function getContributions(username: string) {
  const res = await fetch(
    `${BASE}/search/commits?q=author:${username}&per_page=1`,
    { headers: { ...headers, Accept: "application/vnd.github.cloak-preview" } },
  );
  const data = await res.json();
  return data.total_count || 0;
}
