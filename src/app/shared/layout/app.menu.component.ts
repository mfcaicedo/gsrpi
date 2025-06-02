import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AppMenuitemComponent } from './app.menuitem.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../../auth/interfaces/models/user.model';
import { RoleNames } from '../../auth/enums/roles.enum';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    imports: [AppMenuitemComponent, CommonModule, RouterModule]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    roles: Partial<UserRole>[] = [];

    constructor(
        public layoutService: LayoutService,
        private readonly authService: AuthService
    ) { }

    ngOnInit() {

        //Dependiendo del rol del usuario se construye el menú
        this.authService.getUserDataSession().subscribe(data => {
            this.roles = data.userRoles ?? [];
        });

        this.buildMenu();
    }

    private buildMenu() {
        if (this.roles.length === 0) {
            return;
        }
        //La opcion inicio es comun para todos los roles
        this.model = [
            {
                label: 'Principal',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
        ];
        //Se obtine el menú por cada rol que tenga el usuario
        const menuByRole: any[] = [];
        this.roles.forEach(role => {
            menuByRole.push(this.getMenuByRole(role.role?.name ?? ''));
            // this.model = [...this.model,
            // this.getMenuByRole(role.role?.name ?? '')[0]
            // ]
        });
        //Se agrega el menú por cada rol al menú principal
        for (let i = 0; i < menuByRole.length; i++) {
            if (menuByRole[i].length > 0) {
                this.model = [...this.model, ...menuByRole[i]];
            }
        }
        console.log("this.model", this.model);
        //se agrega la opción de configuración al final del menú
        this.model = [...this.model,
        {
            label: 'Protección de datos',
            items: [
                { label: 'Políticas', icon: 'pi pi-lock', routerLink: ['/politicas'], },
            ]
        }
        ]
    }

    private getMenuByRole(roleName: string) {
        switch (roleName) {
            case RoleNames.ADMIN:
                return [
                    {
                        label: 'Configuración',
                        items: [
                            {
                                label: 'Configuración CPD', icon: 'pi pi-fw pi-cog',
                                items: [
                                    {
                                        label: 'Registrar facultad', icon: 'pi pi-fw pi-cog',
                                        routerLink: ['/configuracion-sistema/registrar-facultad']
                                    },
                                    {
                                        label: 'Registrar miembros CPD', icon: 'pi pi-users',
                                        routerLink: ['/configuracion-sistema/registrar-cpd']
                                    },
                                    {
                                        label: 'Registrar secretaria CPD', icon: 'pi pi-user-plus',
                                        routerLink: ['/configuracion-sistema/registrar-secretaria-cpd']
                                    }
                                ],
                            },
                        ]
                    },
                ]
            case RoleNames.ADMIN_CIARP:
                return [
                    {
                        label: 'Configuración CIARP',
                        items: [
                            {
                                label: 'Listar integrantes CIARP', icon: 'pi pi-list-check',
                                routerLink: ['/configuracion-sistema/gestionar-ciarp']
                            },
                            {
                                label: 'Registrar miembros CIARP', icon: 'pi pi-users',
                                routerLink: ['/configuracion-sistema/registrar-ciarp']
                            },
                            {
                                label: 'Registrar secretaria CIARP', icon: 'pi pi-user-plus',
                                routerLink: ['/configuracion-sistema/registrar-secretaria-ciarp']
                            }
                        ],
                    },
                ]

            case RoleNames.TEACHER:
                return [{
                    label: 'Solicitudes de producción',
                    items: [
                        {
                            label: 'Crear solicitud', icon: 'pi pi-file-plus',
                            routerLink: ['/solicitudes-reconocimiento/crear-solicitud']
                        },
                        {
                            label: 'Listar solicitudes', icon: 'pi pi-list-check',
                            routerLink: ['/solicitudes-reconocimiento/listar-solicitudes']
                        },
                    ]
                }
                ]

            case RoleNames.CPD_SECRETARY:
                return [
                    {
                        label: 'Producción académica',
                        items: [
                            {
                                label: 'Listar solicitudes', icon: 'pi pi-list-check',
                                routerLink: ['/revision-solicitudes/listar-solicitudes-revision']
                            },
                            {
                                label: 'Gestionar agenda', icon: 'pi pi-calendar',
                                routerLink: ['/revision-solicitudes/gestionar-agenda']
                            }
                        ]
                    },
                ]
            case RoleNames.CPD_PRESIDENT:
                return [
                    {
                        label: 'Producción académica',
                        items: [
                            {
                                label: 'Listar solicitudes', icon: 'pi pi-list-check',
                                routerLink: ['/revision-solicitudes/listar-solicitudes-revision-comite']
                            }
                        ]
                    },
                ]
            case RoleNames.CPD_MEMBER:
                return [
                    {
                        label: 'Producción académica',
                        items: [
                            {
                                label: 'Listar solicitudes', icon: 'pi pi-list-check',
                                routerLink: ['/revision-solicitudes/listar-solicitudes-revision-comite']
                            }
                        ]
                    },
                ]
            case RoleNames.CIARP_SECRETARY:
                return [
                    {
                        label: 'Configuración CIARP',
                        items: [
                            {
                                label: 'Listar integrantes CIARP', icon: 'pi pi-list-check',
                                routerLink: ['/configuracion-sistema/gestionar-ciarp']
                            },
                            {
                                label: 'Registrar miembros CIARP', icon: 'pi pi-users',
                                routerLink: ['/configuracion-sistema/registrar-ciarp']
                            },
                            {
                                label: 'Registrar secretaria CIARP', icon: 'pi pi-user-plus',
                                routerLink: ['/configuracion-sistema/registrar-secretaria-ciarp']
                            }
                        ],
                    },
                    {
                        label: 'Producción académica',
                        items: [
                            {
                                label: 'Listar solicitudes', icon: 'pi pi-list-check',
                                routerLink: ['/revision-solicitudes/listar-solicitudes-revision-ciarp']
                            }
                        ]
                    },
                ]
            case RoleNames.CIARP_MEMBER:
                return [
                    {
                        label: 'Producción académica',
                        items: [
                            {
                                label: 'Listar solicitudes', icon: 'pi pi-list-check',
                                routerLink: ['/revision-solicitudes/listar-solicitudes-revision-comite-ciarp']
                            }
                        ]
                    },
                ]
            default:
                return [];
        }

    }

}
