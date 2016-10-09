$cvm = @{}
$cso = New-Object System.Collections.Generic.HashSet[String]

Write-Host "Listing Vms."
$vms = Get-AzureRmVm
$i = 0
foreach ($vm in $vms) {
  Write-Progress -activity "Checking VM Config" -status $vm.name -percentComplete ((++$i / $vms.length)  * 100)
  $ext = Get-AzureRmVMDiagnosticsExtension -ResourceGroupName $vm.ResourceGroupName -VMName $vm.Name
  if($ext) {
    $psettings = $ext.PublicSettings| ConvertFrom-Json
    $sto = $psettings.StorageAccount
    # Workaround for resource group name is in upper case.
    $ar = $vm.Id.Split("/")
    $ar[4]=$ar[4].ToLower()
    $id = $ar -join "/"
    $cvm[$vm.name]=@{
        resourceId=$id;
        diagnosticConfig=$sto
      }
      $ret = $cso.Add($sto)
  }
}

Write-Host "Listing StorageAccounts."
$css = @{}
$sas = Get-AzureRmStorageAccount
$i = 0
foreach ($sa in $sas){
  Write-Progress -activity "Checking StorageAccount" -status $sa.StorageAccountName -percentComplete ((++$i / $sas.length)  * 100)
  if($cso.Contains($sa.StorageAccountName)){
    $gv = Get-AzureRmStorageAccountKey -ResourceGroupName $sa.ResourceGroupName -Name $sa.StorageAccountName
    $key = $gv[1].Value
    $connectionStr = "DefaultEndpointsProtocol=https;AccountName=$($sa.StorageAccountName);AccountKey=$key;"
    $css[$sa.StorageAccountName]=$connectionStr
  }
}

$result = @{virtualMachines=$cvm;connectionStrings=$css}
$json = $result| ConvertTo-Json -Depth 3
Write-Output $json