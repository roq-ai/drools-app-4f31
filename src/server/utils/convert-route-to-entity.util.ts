const mapping: Record<string, string> = {
  libraries: 'library',
  'mp-3s': 'mp3',
  ratings: 'rating',
  'shared-links': 'shared_link',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
