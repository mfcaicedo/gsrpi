import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../auth/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { UserDataSession } from '../../auth/login/interfaces/models/user-data-session.model';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    imports: [CommonModule, RouterModule, MegaMenuModule, MenuModule, MenubarModule, ConfirmDialogModule,
        ToastModule, ButtonModule],
    providers: [ConfirmationService, MessageService]
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    itemsMenuProfile!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    userDataSession: Partial<UserDataSession> = {};

    constructor(
        public layoutService: LayoutService,
        private readonly authService: AuthService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) { }

    ngOnInit(): void {

        //consulto el usuario logueado 
        this.authService.getUserDataSession().subscribe((data: any) => {
            this.userDataSession = data;
        });

        this.itemsMenuProfile = [
            {
                label: this.getUserLabel(),
                icon: 'pi pi-user',
                iconStyle: { 'font-size': '2rem', 'color': 'var(--primary-color)' },
                items: [
                    {
                        label: 'Perfil',
                        icon: 'pi pi-fw pi-cog',
                        command: () => {
                            this.onClickProfile();
                        },

                    },
                    {
                        label: 'Cerrar sesión',
                        icon: 'pi pi-sign-out',
                        command: ($event) => {
                            this.onLogout($event);
                        },
                    }
                ],
            },
        ]

    }

    // Método para generar la etiqueta del usuario
    getUserLabel(): string {
        let rolesHtml = '';

        if (this.userDataSession.userRoles?.length) {
            rolesHtml = this.userDataSession.userRoles
                .map(role => `<span class="badge badge-primary">${role.role?.name}</span>`)
                .join(' ');
        }

        return `<div class="text-primary">
              <h5 class="text-primary mb-0">${this.userDataSession.nombres} ${this.userDataSession.apellidos}</h5>
              ${rolesHtml}
            </div>`;
    }

    onClickProfile() {
        //TODO: Implementar la funcionalidad de perfil
        console.log('Método no implementado');
    }

    onLogout(event: any) {

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro(a) de cerrar sesión?',
            header: 'Confirmación',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,

            },
            acceptButtonProps: {
                label: 'Aceptar',
            },
            accept: () => {
                this.authService.logout();
            },
        });
    }
}
