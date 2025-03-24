import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboard'
    // { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },
    // { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },
    {
        path: '',
        loadChildren: () =>
            import('app/modules/landing/home/home.module').then(
                (m) => m.LandingHomeModule
            ),
        // data: {
        //     layout: 'empty',
        // },
        // children: [
        //     {
        //         path: 'home',
        //         loadChildren: () =>
        //             import('app/modules/landing/home/home.module').then(
        //                 (m) => m.LandingHomeModule
        //             ),
        //     },
        // ],
    },

    // Redirect signed in user to the '/dashboard'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'admin/dashboard',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.module').then(
                        (m) => m.LandingHomeModule
                    ),
            },
        ],
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('app/modules/admin/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'volunteers',
                loadChildren: () =>
                    import(
                        'app/modules/admin/volunteers/volunteers.module'
                    ).then((m) => m.VolunteersModule),
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('app/modules/admin/orders/orders.module').then(
                        (m) => m.OrdersModule
                    ),
            },
            {
                path: 'canopies',
                loadChildren: () =>
                    import('app/modules/admin/canopies/canopies.module').then(
                        (m) => m.CanopiesModule
                    ),
            },
            {
                path: 'donors',
                loadChildren: () =>
                    import('app/modules/admin/donors/donors.module').then(
                        (m) => m.DonorsModule
                    ),
            },
            {
                path: 'error',
                children: [
                    {
                        path: '404',
                        loadChildren: () =>
                            import(
                                'app/modules/error/error-404/error-404.module'
                            ).then((m) => m.Error404Module),
                    },
                    {
                        path: '500',
                        loadChildren: () =>
                            import(
                                'app/modules/error/error-500/error-500.module'
                            ).then((m) => m.Error500Module),
                    },
                ],
            },
            {
                path: 'install-as-app',
                loadChildren: () =>
                    import('app/modules/admin/canopies/canopies.module').then(
                        (m) => m.CanopiesModule
                    ),
            },

            { path: '**', redirectTo: 'admin/dashboard' },
        ],
    },

    {
        path: 'donor',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('app/modules/donor/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('app/modules/donor/orders/orders.module').then(
                        (m) => m.DonorsOrdersModule
                    ),
            },
            {
                path: 'error',
                children: [
                    {
                        path: '404',
                        loadChildren: () =>
                            import(
                                'app/modules/error/error-404/error-404.module'
                            ).then((m) => m.Error404Module),
                    },
                    {
                        path: '500',
                        loadChildren: () =>
                            import(
                                'app/modules/error/error-500/error-500.module'
                            ).then((m) => m.Error500Module),
                    },
                ],
            },
            {
                path: 'install-as-app',
                loadChildren: () =>
                    import('app/modules/admin/canopies/canopies.module').then(
                        (m) => m.CanopiesModule
                    ),
            },

            { path: '**', redirectTo: 'donor/dashboard' },
        ],
    },
    {
        path: 'volunteer',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import(
                        'app/modules/volunteer/dashboard/dashboard.module'
                    ).then((m) => m.DashboardModule),
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('app/modules/volunteer/orders/orders.module').then(
                        (m) => m.VolunteerOrdersModule
                    ),
            },
            {
                path: 'error',
                children: [
                    {
                        path: '404',
                        loadChildren: () =>
                            import(
                                'app/modules/error/error-404/error-404.module'
                            ).then((m) => m.Error404Module),
                    },
                    {
                        path: '500',
                        loadChildren: () =>
                            import(
                                'app/modules/error/error-500/error-500.module'
                            ).then((m) => m.Error500Module),
                    },
                ],
            },
            {
                path: 'install-as-app',
                loadChildren: () =>
                    import('app/modules/admin/canopies/canopies.module').then(
                        (m) => m.CanopiesModule
                    ),
            },

            { path: '**', redirectTo: 'donor/dashboard' },
        ],
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'settings',
                loadChildren: () =>
                    import('app/modules/settings/settings.module').then(
                        (m) => m.SettingsModule
                    ),
            },
        ],
    },
];
