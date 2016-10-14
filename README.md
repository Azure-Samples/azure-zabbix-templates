# azure-zabbix-templates
## Monitoring templates for Azure VM
Supports reading diagnostic data for virtual machines on Azure.

### How to use
1. Create a VM with Zabbix installed

   Install Zabbix server manually according [document](https://www.zabbix.com/documentation/2.2/manual/installation) or use [zabbix quickstart sample for zabbix](https://github.com/Azure/azure-quickstart-templates/tree/master/zabbix-monitoring-cluster).

   Install Zabbix agent on the same machine, and config to to talk to the server. The quick start sample will automaticlly do this. 

2. Prepare the hosting VM

   Install nodejs, and make sure 'node' command line is accessable via command line.

   For example, for Ubuntu 14.04 VM, try:
  ```
  sudo apt install --no-install-recommends -y nodejs-legacy npm
  ```

3. Clone the project and run setup

   ```
   sudo apt install -y git
   git clone https://github.com/Azure/azure-zabbix-templates.git
   pushd azure-zabbix-templates
   npm install
   npm run release
   popd
   ```

4. Set up zabbix agent

   - Link the project to '/opt', you can also use any location you want, but remember to update `azure_monitoring_agentd.conf`, so that it would point to correct path.
   - Copy config file for zabbix agent.
   - Restart zabbix agent.
   ```
   sudo ln -s $(pwd)/azure-zabbix-templates/dist/azure-zabbix-templates /opt/azure-zabbix
   sudo cp azure-zabbix-templates/conf/azure_monitoring_agentd.conf /etc/zabbix/zabbix_agentd.conf.d/
   sudo service zabbix-agent restart
   ```

5. Setup conf.json

   From a powershell console, log in an Azure account, then run genconf.ps1, it would automatically scan all VM with diagnostic data, and generate a 'conf.json'.

   Copy 'conf.json' to /opt/azure-zabbix/lib/

6. Import zabbix tempate

   Import 'conf/azure_monitoring_templstes.xml' through Zabbix portal, and link the current host with the template.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
