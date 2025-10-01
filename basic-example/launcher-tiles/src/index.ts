import {
    JupyterFrontEnd,
    JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {ILauncher} from '@jupyterlab/launcher';
import {IFileBrowserFactory} from '@jupyterlab/filebrowser';
import {NotebookPanel} from '@jupyterlab/notebook';
import {requestTemplate} from "./handler";

const templates = [{
    cmd: 'starter:create-oracle',
    label: 'Python 3.11 w/ OracleDB',
    caption: 'Create a new notebook prefilled with OracleDB helper cells',
    name: 'sample.ipynb',
    kernel: 'python3',
    icon: 'https://pic.onlinewebfonts.com/thumbnails/icons_248288.svg',
}, {
    cmd: 'starter:create-oracle2',
    label: 'Python 3.11 w/ OracleDB (Again)',
    caption: 'Create a new notebook prefilled with OracleDB helper cells',
    name: 'sample.ipynb',
    kernel: 'python3',
    icon: 'https://pic.onlinewebfonts.com/thumbnails/icons_248288.svg',
}]

const plugin: JupyterFrontEndPlugin<void> = {
    id: 'starter-notebooks:oracle',
    autoStart: true,
    requires: [ILauncher, IFileBrowserFactory],
    activate: (
        app: JupyterFrontEnd,
        launcher: ILauncher,
        factory: IFileBrowserFactory
    ) => {
        const {commands, serviceManager} = app;
        const contents = serviceManager.contents;

        templates.forEach(template => {
            commands.addCommand(template.cmd, {
                label: template.label,
                caption: template.caption,
                execute: async () => {
                    const tpl = await requestTemplate(template.name);

                    const created = await contents.newUntitled({
                        path: '.',
                        type: 'notebook',
                        ext: '.ipynb'
                    });

                    await contents.save(created.path, {
                        type: 'notebook',
                        format: 'json',
                        content: tpl
                    });

                    const widget = (await commands.execute('docmanager:open', {
                        path: created.path
                    })) as NotebookPanel;

                    await widget.context.sessionContext.initialize();
                    await widget.context.sessionContext.changeKernel({name: template.kernel});
                    app.shell.activateById(widget.id);
                }
            });
            launcher.add({
                command: template.cmd,
                category: 'Notebook',
                rank: 50,
                kernelIconUrl: template.icon
            });
        });
    }
};

export default plugin;
