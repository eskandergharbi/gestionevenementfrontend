import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Importation correcte

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
console.log(token);

  if (token) {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role; // Assuming the role is stored in the token
   console.log(userRole);

    if (hasAccess(userRole)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }
};

// Fonction utilitaire pour vérifier l'accès
const hasAccess = (role: string): boolean => {
  return role === 'admin'|| role==='project_manager'; // Exemple : seul l'admin a accès
};
