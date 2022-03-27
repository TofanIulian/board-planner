import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => {
  // TODO: make this a nice snack bar like in the initial AuthGuard from ./user/auth.guard
  // alert('You must be logged in');
  return redirectUnauthorizedTo(['login']);
};
const redirectLoggedInToKanban = () => redirectLoggedInTo(['kanban']);

// TODO: check out how claims work in with firebase
// const adminOnly = () => hasCustomClaim('admin');
// const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    ...canActivate(redirectLoggedInToKanban),
  },
  {
    path: 'kanban',
    loadChildren: () => import('./kanban/kanban.module').then((m) => m.KanbanModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then((m) => m.CustomersModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
