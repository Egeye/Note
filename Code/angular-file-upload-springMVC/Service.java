public Map<String, Object> uploadFile(String path, MultipartFile file, Long staffId){
	Date dateTime = new Date(System.currentTimeMillis());
	String dateTimeStr = dateTime.getTime() + "";
	String fileRealName = file.getOriginalFilename();
	String fileSaveName = staffId + "-" + dateTimeStr + "-" + fileRealName;
	List<Map<String, Object>> serverInfo = oprtMapper.getServerInfo();
	File targetFile = new File(path, fileSaveName);
	if(!targetFile.exists()){
		targetFile.mkdirs();
	}
	Map<String, Object> response = new HashMap<>();
	response.put("srcFilePath", path);
	response.put("serverInfo", serverInfo);
	response.put("staffId", staffId);
	response.put("fileRealName", fileRealName);
	response.put("fileSaveName", fileSaveName);
	try {
		file.transferTo(targetFile);
		response.put("result","0");
	} catch (Exception e) {
		e.printStackTrace();
		response.put("result","1");
		return response;
	}
	return response;
}
