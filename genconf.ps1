$cvm = @{}
$cso = New-Object System.Collections.Generic.HashSet[String]

Write-Host "Get resourceGroups"
$rgs = Get-AzureRmResourceGroup
$i = 0
foreach($rg in $rgs){
  $resourceGroupName = $rg.ResourceGroupName
  Write-Progress -activity "Scanning VM" -status $resourceGroupName -percentComplete ((++$i / $rgs.length)  * 100)
  $vms = Get-AzureRmVm -ResourceGroupName $resourceGroupName
  
  foreach ($vm in $vms) {
    $ext = Get-AzureRmVMDiagnosticsExtension -ResourceGroupName $resourceGroupName -VMName $vm.Name
    if($ext) {
      $psettings = $ext.PublicSettings| ConvertFrom-Json
      $sto = $psettings.StorageAccount
      $cvm[$vm.name]=@{
          resourceId=$vm.Id;
          diagnosticConfig=$sto
        }
        $ret = $cso.Add($sto)
    }
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
[System.IO.File]::WriteAllLines("$PSScriptRoot\\conf.json", $json)