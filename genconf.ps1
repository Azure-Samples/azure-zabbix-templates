$cvm = @{}
$cso = New-Object System.Collections.Generic.HashSet[String]

Write-Host "Get resourceGroups"
$rgs = Get-AzureRmResourceGroup
$i = 0
$vmc = (Get-AzureRmVm).length
foreach($rg in $rgs){
  $resourceGroupName = $rg.ResourceGroupName
  $vms = Get-AzureRmVm -ResourceGroupName $resourceGroupName
  
  foreach ($vm in $vms) {
    Write-Progress -activity "Scanning VM" -status "$resourceGroupName/$($vm.Name)" -percentComplete ((++$i / $vmc)  * 100)
    $ext = $null
    $ext = Get-AzureRmVMExtension -ResourceGroupName $resourceGroupName -VMName $vm.Name -Name Microsoft.Insights.VMDiagnosticsSettings 2> $null
  if(!$ext){
    $ext = Get-AzureRmVMExtension -ResourceGroupName $resourceGroupName -VMName $vm.Name -Name LinuxDiagnostic 2> $null
  }

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
  if($cso.Contains($sa.StorageAccountName)){
    Write-Progress -activity "Checking StorageAccount" -status $sa.StorageAccountName -percentComplete ((++$i / $cso.Count)  * 100)
    $gv = Get-AzureRmStorageAccountKey -ResourceGroupName $sa.ResourceGroupName -Name $sa.StorageAccountName
    $key = $gv[1].Value
    $connectionStr = "DefaultEndpointsProtocol=https;AccountName=$($sa.StorageAccountName);AccountKey=$key;"
    $css[$sa.StorageAccountName]=$connectionStr
  }
}

$result = @{virtualMachines=$cvm;connectionStrings=$css}
$json = $result| ConvertTo-Json -Depth 3 
[System.IO.File]::WriteAllLines("$PSScriptRoot\\conf.json", $json)