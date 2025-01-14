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

    constructor(
        public layoutService: LayoutService,
        private readonly authService: AuthService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.itemsMenuProfile = [
            {
                label: '<div class="text-primary">' +
                    '<h5 class="text-primary mb-0">' +
                    'Milthon Caicedo' +
                    '</h5>' +
                    '<span>Administrador</span></div>',
                icon: 'pi pi-user',
                iconStyle: { 'font-size': '2rem', 'color': 'var(--primary-color)' },
                command: () => {
                    this.onClickProfile();
                },
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
